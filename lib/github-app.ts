import "server-only";

import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

function expandHome(path: string): string {
  if (path === "~") {
    return homedir();
  }

  if (path.startsWith("~/")) {
    return resolve(homedir(), path.slice(2));
  }

  return path;
}

export async function createGitHubAppClient() {
  const appId = process.env.GITHUB_APP_ID;
  const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_PATH;

  if (!appId || !privateKeyPath) {
    throw new Error("GitHub App environment variables are missing");
  }

  const privateKey = await readFile(
    expandHome(privateKeyPath),
    "utf8"
  );

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
    },
  });
}

export async function createGitHubInstallationClient(
  installationId: number
) {
  const appId = process.env.GITHUB_APP_ID;
  const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_PATH;

  if (!appId || !privateKeyPath) {
    throw new Error("GitHub App environment variables are missing");
  }

  const privateKey = await readFile(
    expandHome(privateKeyPath),
    "utf8"
  );

  const auth = createAppAuth({
    appId,
    privateKey,
  });

  const installationAuth = await auth({
    type: "installation",
    installationId,
  });

  return new Octokit({
    auth: installationAuth.token,
  });
}

export async function getGitHubInstallationToken(
  installationId: number
): Promise<string> {
  const appId = process.env.GITHUB_APP_ID;
  const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_PATH;

  if (!appId || !privateKeyPath) {
    throw new Error("GitHub App environment variables are missing");
  }

  const privateKey = await readFile(
    expandHome(privateKeyPath),
    "utf8"
  );

  const auth = createAppAuth({
    appId,
    privateKey,
  });

  const installationAuth = await auth({
    type: "installation",
    installationId,
  });

  return installationAuth.token;
}