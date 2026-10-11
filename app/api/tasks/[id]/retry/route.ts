import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Prisma } from "@/app/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runStudentAgent } from "@/lib/student-agent";
import { getGitHubInstallationToken } from "@/lib/github-app";
import {
  TASK_STAGE_DEFINITIONS,
  createInitialTaskStages,
} from "@/lib/task-stages";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    // Знаходимо початкове завдання поточного користувача.
    const originalTask = await prisma.task.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!originalTask) {
      return NextResponse.json(
        { error: "Завдання не знайдено" },
        { status: 404 },
      );
    }

    // Повторний запуск дозволений лише для невдалих завдань.
    if (originalTask.status !== "failed") {
      return NextResponse.json(
        {
          error: "Повторно можна запустити лише невдале завдання",
        },
        { status: 400 },
      );
    }

    // Перевіряємо підключення GitHub.
    const githubConnection = await prisma.gitHubConnection.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!githubConnection) {
      return NextResponse.json(
        { error: "GitHub не підключено" },
        { status: 400 },
      );
    }

    // Отримуємо токен GitHub App.
    const installationToken = await getGitHubInstallationToken(
      githubConnection.installationId,
    );

    // Створюємо нову гілку для повторної спроби.
    const branchName =
      `retry-${originalTask.id}-${Date.now().toString(36)}`;

    // Створюємо окреме завдання, пов'язане з початковим.
    const retryTask = await prisma.task.create({
      data: {
        userId: originalTask.userId,
        title: originalTask.title,
        subject: originalTask.subject,
        customSubject: originalTask.customSubject,
        repositoryId: originalTask.repositoryId,
        repositoryFullName: originalTask.repositoryFullName,
        assignmentText: originalTask.assignmentText,
        additionalContext: originalTask.additionalContext,

        status: "queued",
        currentStageIndex: 1,

        stages: createInitialTaskStages() as Prisma.InputJsonValue,
        files: [],
        validationChecks: [],

        outputOptions:
          originalTask.outputOptions === null
            ? Prisma.JsonNull
            : (originalTask.outputOptions as Prisma.InputJsonValue),

        branchName,
        commitMessage: originalTask.commitMessage,
        parentTaskId: originalTask.id,
      },
    });

    // Позначаємо завдання як запущене.
    await prisma.task.update({
      where: {
        id: retryTask.id,
      },
      data: {
        status: "running",
        errorDetails: null,
      },
    });

    // Запускаємо агента асинхронно, не затримуючи HTTP-відповідь.
    void (async () => {
      try {
        await runStudentAgent({
          assignment: [
            `ОСНОВНЕ ЗАВДАННЯ:\n${retryTask.assignmentText}`,
            retryTask.additionalContext?.trim()
              ? `ДОДАТКОВІ ВИМОГИ:\n${retryTask.additionalContext.trim()}`
              : "",
          ]
            .filter(Boolean)
            .join("\n\n"),

          repositoryUrl:
            `https://github.com/${retryTask.repositoryFullName}`,

          branch: retryTask.branchName!,
          tasksFolder: `task-${retryTask.id}`,
          commitMessage: retryTask.commitMessage!,
          installationToken,

          onStage: async (stageId) => {
            const stageIndex = TASK_STAGE_DEFINITIONS.findIndex(
              (stage) => stage.id === stageId,
            );

            if (stageIndex === -1) {
              console.warn(`Unknown task stage: ${stageId}`);
              return;
            }

            const stages = TASK_STAGE_DEFINITIONS.map(
              (stage, index) => ({
                ...stage,
                status:
                  index < stageIndex
                    ? "completed"
                    : index === stageIndex
                      ? "running"
                      : "pending",
              }),
            );

            // Отримуємо SHA останнього коміту з GitHub
            try {
              const response = await fetch(
                `https://api.github.com/repos/${retryTask.repositoryFullName}/branches/${encodeURIComponent(retryTask.branchName!)}`,
                {
                  headers: {
                    Authorization: `Bearer ${installationToken}`,
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                  },
                  cache: "no-store",
                },
              );
            
              if (!response.ok) {
                throw new Error(
                  `GitHub API error: ${response.status} ${response.statusText}`,
                );
              }
            
              const branchData = await response.json();
              const commitSha = branchData.commit?.sha;
            
              if (typeof commitSha === "string") {
                await prisma.task.update({
                  where: { id: retryTask.id },
                  data: { commitSha },
                });
              }
            } catch (error) {
              console.error(
                `Could not save commit SHA for retry task ${retryTask.id}:`,
                error,
              );
            }

            await prisma.task.update({
              where: {
                id: retryTask.id,
              },
              data: {
                status: "running",
                currentStageIndex: stageIndex + 1,
                stages: stages as Prisma.InputJsonValue,
              },
            });

            console.log(
              `Retry task ${retryTask.id}: stage ${stageIndex + 1}/${TASK_STAGE_DEFINITIONS.length} — ${TASK_STAGE_DEFINITIONS[stageIndex].title}`,
            );
          },
        });

        // Агент завершив роботу.
        const latestTask = await prisma.task.findUnique({
          where: {
            id: retryTask.id,
          },
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
          where: {
            id: retryTask.id,
          },
          data: {
            status: "completed",
            stages: completedStages as Prisma.InputJsonValue,
            errorDetails: null,
          },
        });

        console.log(`Retry task ${retryTask.id} completed successfully.`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        console.error(
          `Retry task ${retryTask.id} failed:`,
          errorMessage,
        );

        try {
          const latestTask = await prisma.task.findUnique({
            where: {
              id: retryTask.id,
            },
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
            where: {
              id: retryTask.id,
            },
            data: {
              status: "failed",
              stages: failedStages as Prisma.InputJsonValue,
              errorDetails: errorMessage,
            },
          });
        } catch (updateError) {
          console.error(
            `Could not update retry task ${retryTask.id}:`,
            updateError,
          );
        }
      }
    })();

    return NextResponse.json(
      {
        success: true,
        task: {
          ...retryTask,
          status: "running",
        },
        message: "Повторне завдання запущено",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to retry task:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Не вдалося повторно запустити завдання",
      },
      { status: 500 },
    );
  }
}