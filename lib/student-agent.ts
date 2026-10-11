import "server-only";
import { spawn } from "node:child_process";
import path from "node:path";

interface RunAgentOptions {
  assignment: string;
  repositoryUrl: string;
  branch: string;
  tasksFolder: string;
  commitMessage: string;
  installationToken: string;
  onStage?: (stageId: string) => Promise<void>;
}

export async function runStudentAgent(
  options: RunAgentOptions,
): Promise<void> {
  const agentPath = process.env.STUDENT_AGENT_PATH;
  const pythonPath = process.env.STUDENT_AGENT_PYTHON;

  if (!agentPath || !pythonPath) {
    throw new Error(
      "Student agent environment variables are missing",
    );
  }

  const scriptPath = path.join(agentPath, "agent.py");

  const args = [
    scriptPath,
    "--assignment",
    options.assignment,
    "--repo-url",
    options.repositoryUrl,
    "--branch",
    options.branch,
    "--tasks-folder",
    options.tasksFolder,
    "--commit-message",
    options.commitMessage,
  ];

  await new Promise<void>((resolve, reject) => {
    const child = spawn(pythonPath, args, {
      cwd: agentPath,
      env: {
        ...process.env,
        GITHUB_TOKEN: options.installationToken,
        PYTHONUNBUFFERED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let stdoutBuffer = "";
    let settled = false;

    let stageUpdateQueue: Promise<void> = Promise.resolve();

    const processLine = (line: string) => {
      const prefix = "STUDYFLOW_STAGE:";

      if (!line.startsWith(prefix)) return;

      const stageId = line.slice(prefix.length).trim();

      if (!stageId) return;

      stageUpdateQueue = stageUpdateQueue
        .then(async () => {
          await options.onStage?.(stageId);
        })
        .catch((error) => {
          console.error(
            `Failed to update task stage "${stageId}":`,
            error,
          );
        });
    };

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
      stdoutBuffer += chunk;

      const lines = stdoutBuffer.split(/\r?\n/);
      stdoutBuffer = lines.pop() ?? "";

      for (const line of lines) {
        processLine(line);
      }
    });

    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    child.on("error", (error) => {
      if (settled) return;

      settled = true;

      console.error("Failed to start student agent:", error);

      reject(
        new Error(
          `Failed to start student agent: ${error.message}`,
        ),
      );
    });

    child.on("close", async (code, signal) => {
      if (stdoutBuffer) {
        processLine(stdoutBuffer);
      }

      await stageUpdateQueue;

      if (settled) return;
      settled = true;

      if (code === 0) {
        resolve();
        return;
      }

      const combinedOutput = [stderr, stdout]
        .filter(Boolean)
        .join("\n");

      console.error(
        "Student agent failed.",
        {
          exitCode: code,
          signal,
          stderr,
          stdout,
        },
      );

      const lines = combinedOutput
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      const fatalError = [...lines]
        .reverse()
        .find((line) => line.includes("FATAL ERROR:"));

      const usefulOutput = fatalError
        ? fatalError
        : lines.slice(-12).join("\n");

      const reason =
        code !== null
          ? `Student agent exited with code ${code}.`
          : `Student agent was terminated${signal ? ` by ${signal}` : ""}.`;

      reject(
        new Error(
          `${reason}\n\n${usefulOutput || "No error details were provided."}`,
        ),
      );
    });
  });
}