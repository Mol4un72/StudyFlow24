import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const installationId = url.searchParams.get("installation_id");
  const setupAction = url.searchParams.get("setup_action");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("github_oauth_state")?.value;

  if (!state || !savedState || state !== savedState) {
    return NextResponse.json(
      { error: "Невірний або прострочений state" },
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

  if (!installationId || !/^\d+$/.test(installationId)) {
    return NextResponse.json(
      { error: "GitHub не повернув коректний installation_id" },
      { status: 400 }
    );
  }

  if (setupAction !== "install" && setupAction !== "update") {
    return NextResponse.json(
      { error: "Невідома дія встановлення GitHub App" },
      { status: 400 }
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "GitHub OAuth не налаштований" },
      { status: 500 }
    );
  }

  const oauthState = randomBytes(32).toString("hex");

  const authorizationUrl = new URL(
    "https://github.com/login/oauth/authorize"
  );

  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("state", oauthState);

  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set("github_oauth_state", oauthState, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/github/callback",
    maxAge: 600,
  });

  response.cookies.set(
    "github_pending_installation_id",
    installationId,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/github/callback",
      maxAge: 600,
    }
  );

  return response;
}