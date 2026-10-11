import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createGitHubAppClient } from "@/lib/github-app";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const octokit = await createGitHubAppClient();
    const response = await octokit.apps.getAuthenticated();
    const app = response.data;
    
    if (!app) {
      return NextResponse.json(
        { error: "GitHub App не знайдено" },
        { status: 502 }
      );
    }
    
    return NextResponse.json({
      connected: true,
      appName: app.name,
      appSlug: app.slug,
    });
  } catch (error) {
    console.error("GitHub App verification failed:", error);

    return NextResponse.json(
      { error: "Не вдалося перевірити GitHub App. Перевір налаштування сервера." },
      { status: 500 }
    );
  }
}