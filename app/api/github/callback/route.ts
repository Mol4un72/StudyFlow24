import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGitHubAppClient } from "@/lib/github-app";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();

  const savedState = cookieStore.get("github_oauth_state")?.value;

  const pendingInstallationId = cookieStore.get(
    "github_pending_installation_id"
  )?.value;

  if (!state || !savedState || state !== savedState) {
    return NextResponse.json(
      { error: "Невірний або прострочений state" },
      { status: 400 }
    );
  }

  if (
    !pendingInstallationId ||
    !/^\d+$/.test(pendingInstallationId)
  ) {
    return NextResponse.json(
      {
        error:
          "Не знайдено встановлення GitHub App. Спробуй підключити GitHub ще раз.",
      },
      { status: 400 }
    );
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Необхідно увійти в StudyFlow" },
      { status: 401 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "GitHub не повернув authorization code" },
      { status: 400 }
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const appId = Number(process.env.GITHUB_APP_ID);

  if (
    !clientId ||
    !clientSecret ||
    !Number.isSafeInteger(appId) ||
    appId <= 0
  ) {
    return NextResponse.json(
      { error: "GitHub OAuth або App не налаштований" },
      { status: 500 }
    );
  }

  try {
    // 1. Обмінюємо OAuth code на access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
        cache: "no-store",
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error(
        "GitHub OAuth token exchange failed:",
        tokenData.error
      );

      return NextResponse.json(
        { error: "Не вдалося авторизуватися через GitHub" },
        { status: 502 }
      );
    }

    // 2. Отримуємо GitHub-користувача
    const githubHeaders = {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    const userResponse = await fetch(
      "https://api.github.com/user",
      {
        headers: githubHeaders,
        cache: "no-store",
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Не вдалося отримати дані GitHub-користувача" },
        { status: 502 }
      );
    }

    const githubUser = await userResponse.json();

    // 3. Перевіряємо встановлення через автентифікацію GitHub App
    const installationId = Number(pendingInstallationId);

    const appOctokit = await createGitHubAppClient();

    const installationResponse = await appOctokit.request(
      "GET /app/installations/{installation_id}",
      {
        installation_id: installationId,
      }
    );

    const installationData = installationResponse.data;

    if (installationData.app_id !== appId) {
      return NextResponse.json(
        { error: "Це встановлення належить іншому GitHub App" },
        { status: 403 }
      );
    }

    // 4. Перевіряємо, що OAuth-користувач має доступ
    // до цього встановлення GitHub App
    const installationsResponse = await fetch(
      "https://api.github.com/user/installations?per_page=100",
      {
        headers: githubHeaders,
        cache: "no-store",
      }
    );

    if (!installationsResponse.ok) {
      console.error(
        "Failed to fetch user installations:",
        installationsResponse.status
      );

      return NextResponse.json(
        { error: "Не вдалося перевірити доступ до встановлення" },
        { status: 502 }
      );
    }

    const installationsData = await installationsResponse.json();

    const hasAccess = installationsData.installations.some(
      (installation: { id: number; app_id: number }) =>
        installation.id === installationId &&
        installation.app_id === appId
    );

    if (!hasAccess) {
      return NextResponse.json(
        {
          error:
            "Цей GitHub-користувач не має доступу до вибраного встановлення StudyFlow24",
        },
        { status: 403 }
      );
    }

    // 5. Зберігаємо підключення для поточного користувача StudyFlow
    await prisma.gitHubConnection.upsert({
      where: {
        userId: session.user.id,
      },
      create: {
        userId: session.user.id,
        installationId,
        githubUsername: githubUser.login,
        avatarUrl: githubUser.avatar_url ?? null,
      },
      update: {
        installationId,
        githubUsername: githubUser.login,
        avatarUrl: githubUser.avatar_url ?? null,
      },
    });

    // 6. Повертаємо користувача в налаштування StudyFlow
    const response = NextResponse.redirect(
      new URL("/settings?github=connected", request.url)
    );

    response.cookies.set("github_oauth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/github/callback",
      maxAge: 0,
    });

    response.cookies.set("github_pending_installation_id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/github/callback",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("GitHub callback failed:", error);

    return NextResponse.json(
      { error: "Не вдалося завершити підключення GitHub" },
      { status: 500 }
    );
  }
}