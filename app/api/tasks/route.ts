import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runStudentAgent } from "@/lib/student-agent";
import { getGitHubInstallationToken } from "@/lib/github-app";
import { checkPaidAccess } from "@/lib/access";
import {
  TASK_STAGE_DEFINITIONS,
  createInitialTaskStages,
} from "@/lib/task-stages";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);

    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await checkPaidAccess(
      session.user.id,
      session.user.email,
    );

    if (!access.allowed) {
      return NextResponse.json(
        {
          error: access.error,
          code: access.code,
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const {
      subject,
      customSubject,
      repositoryId,
      repositoryName,
      instructions,
      additionalContext,
      branchName,
      commitMessage,
      outputOptions,
    } = body;

    if (
      typeof subject !== "string" ||
      typeof repositoryName !== "string" ||
      typeof instructions !== "string" ||
      !subject.trim() ||
      !repositoryName.trim() ||
      !instructions.trim()
    ) {
      return NextResponse.json(
        { error: "Subject, repository and instructions are required" },
        { status: 400 },
      );
    }

    const normalizedSubject = subject.trim();

    const isProgramming = normalizedSubject === "Програмування";
    const isDatabases = normalizedSubject === "Бази даних";

    const effectiveOutputOptions = {
      separateBranch: !isDatabases,
      generateReport:
        isProgramming && outputOptions?.generateReport === true,
      generateArchive:
        isProgramming && outputOptions?.generateArchive === true,
    };

    const effectiveSubject =
      subject === "Other" && typeof customSubject === "string"
        ? customSubject.trim()
        : subject.trim();

    if (!effectiveSubject) {
      return NextResponse.json(
        { error: "Subject cannot be empty" },
        { status: 400 },
      );
    }

    const firstLine = instructions.trim().split("\n")[0].slice(0, 45);

    const slug = effectiveSubject
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const connection = await prisma.gitHubConnection.findUnique({
      where: { userId: session.user.id },
      select: { installationId: true },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "GitHub is not connected" },
        { status: 400 },
      );
    }

    const installationToken = await getGitHubInstallationToken(
      connection.installationId,
    );

    let effectiveBranchName =
      typeof branchName === "string" && branchName.trim()
        ? branchName.trim()
        : `practice-${slug || "assignment"}-${Date.now().toString(36)}`;

    const branchMode: "named" | "current" = isDatabases
      ? "current"
      : "named";

    if (isDatabases) {
      const repoParts = repositoryName.trim().split("/");

      if (
        repoParts.length !== 2 ||
        !repoParts[0] ||
        !repoParts[1]
      ) {
        return NextResponse.json(
          { error: "Invalid GitHub repository name" },
          { status: 400 },
        );
      }

      const [owner, repo] = repoParts;

      const repoResponse = await fetch(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
        {
          headers: {
            Authorization: `Bearer ${installationToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          cache: "no-store",
        },
      );

      if (!repoResponse.ok) {
        throw new Error(
          `Не вдалося отримати інформацію про репозиторій GitHub: ${repoResponse.status}`,
        );
      }

      const repoData = await repoResponse.json();

      if (
        typeof repoData.default_branch !== "string" ||
        !repoData.default_branch.trim()
      ) {
        throw new Error("GitHub не повернув основну гілку репозиторію.");
      }

      effectiveBranchName = repoData.default_branch;
    }

    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        title: `${effectiveSubject} — ${firstLine || "Практичне завдання"}`,
        subject: effectiveSubject,
        customSubject:
          typeof customSubject === "string" ? customSubject.trim() : null,
        repositoryId:
          typeof repositoryId === "string" ? repositoryId : "",
        repositoryFullName: repositoryName.trim(),
        assignmentText: instructions.trim(),
        additionalContext:
          typeof additionalContext === "string"
            ? additionalContext.trim()
            : null,
        status: "queued",
        currentStageIndex: 1,
        branchName: effectiveBranchName,
        commitMessage:
          typeof commitMessage === "string" && commitMessage.trim()
            ? commitMessage.trim()
            : `Виконання практичної роботи: ${firstLine || effectiveSubject}`,
        outputOptions: effectiveOutputOptions,
        stages: createInitialTaskStages(),
        files: [],
        validationChecks: [],
      },
    });

    await prisma.task.update({
      where: { id: task.id },
      data: {
        status: "running",
        errorDetails: null,
      },
    });

    void (async () => {
      try {
        const pushedCommitSha = await runStudentAgent({
          assignment: [
            `ОСНОВНЕ ЗАВДАННЯ:\n${task.assignmentText}`,
            task.additionalContext?.trim()
              ? `ДОДАТКОВІ ВИМОГИ:\n${task.additionalContext.trim()}`
              : "",
          ]
            .filter(Boolean)
            .join("\n\n"),
          repositoryUrl: `https://github.com/${task.repositoryFullName}`,
          branch: task.branchName!,
          branchMode,
          tasksFolder: `task-${task.id}`,
          commitMessage: task.commitMessage!,
          installationToken,
          generateReport: effectiveOutputOptions.generateReport,
          generateArchive: effectiveOutputOptions.generateArchive,

          onStage: async (stageId) => {
            const stageIndex = TASK_STAGE_DEFINITIONS.findIndex(
              (stage) => stage.id === stageId,
            );

            if (stageIndex === -1) {
              console.warn(`Unknown task stage: ${stageId}`);
              return;
            }

            const stages = TASK_STAGE_DEFINITIONS.map((stage, index) => ({
              ...stage,
              status:
                index < stageIndex
                  ? "completed"
                  : index === stageIndex
                    ? "running"
                    : "pending",
            }));

            await prisma.task.update({
              where: { id: task.id },
              data: {
                status: "running",
                currentStageIndex: stageIndex + 1,
                stages,
              },
            });

            console.log(
              `Task ${task.id}: stage ${stageIndex + 1}/${TASK_STAGE_DEFINITIONS.length} — ${TASK_STAGE_DEFINITIONS[stageIndex].title}`,
            );
          },
        });

        if (pushedCommitSha) {
          await prisma.task.update({
            where: { id: task.id },
            data: { commitSha: pushedCommitSha },
          });
        }

        const latestTask = await prisma.task.findUnique({
          where: { id: task.id },
          select: {
            stages: true,
            currentStageIndex: true,
          },
        });

        const currentIndex = latestTask?.currentStageIndex ?? 1;

        const currentStages = Array.isArray(latestTask?.stages)
          ? (latestTask.stages as Array<Record<string, unknown>>)
          : [];

        const completedStages = currentStages.map((stage, index) => ({
          ...stage,
          status: index < currentIndex ? "completed" : "skipped",
        }));

        await prisma.task.update({
          where: { id: task.id },
          data: {
            status: "completed",
            stages: completedStages,
            errorDetails: null,
          },
        });

        console.log(`Task ${task.id} completed successfully.`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        console.error(`Task ${task.id} failed:`, errorMessage);

        try {
          const latestTask = await prisma.task.findUnique({
            where: { id: task.id },
            select: {
              stages: true,
              currentStageIndex: true,
            },
          });

          const currentIndex = latestTask?.currentStageIndex ?? 1;

          const currentStages = Array.isArray(latestTask?.stages)
            ? (latestTask.stages as Array<Record<string, unknown>>)
            : [];

          const failedStages = currentStages.map((stage, index) => ({
            ...stage,
            status:
              index < currentIndex - 1
                ? "completed"
                : index === currentIndex - 1
                  ? "failed"
                  : "pending",
          }));

          await prisma.task.update({
            where: { id: task.id },
            data: {
              status: "failed",
              stages: failedStages,
              errorDetails: errorMessage,
            },
          });
        } catch (updateError) {
          console.error(
            `Could not update status for task ${task.id}:`,
            updateError,
          );
        }
      }
    })();

    return NextResponse.json(
      { ...task, status: "running" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create task:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}