import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGitHubInstallationClient } from "@/lib/github-app";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Необхідно увійти в StudyFlow" },
      { status: 401 }
    );
  }

  try {
    const connection = await prisma.gitHubConnection.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        installationId: true,
      },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "GitHub ще не підключений" },
        { status: 404 }
      );
    }

    const octokit = await createGitHubInstallationClient(
      connection.installationId
    );

    const response = await octokit.request(
      "GET /installation/repositories",
      {
        per_page: 100,
      }
    );

    const repositories = response.data.repositories.map((repo) => ({
      id: String(repo.id),
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description ?? "",
      url: repo.html_url,
      isPrivate: repo.private,
      defaultBranch: repo.default_branch,
      language: repo.language ?? "",
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at,
    }));

    return NextResponse.json({ repositories });
  } catch (error) {
    console.error("Failed to fetch GitHub repositories:", error);

    return NextResponse.json(
      { error: "Не вдалося отримати репозиторії GitHub" },
      { status: 500 }
    );
  }
}