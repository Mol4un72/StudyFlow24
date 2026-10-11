import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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

  const state = randomBytes(32).toString("hex");

  const installationUrl = new URL(
    "https://github.com/apps/studyflow24/installations/new"
  );

  installationUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(installationUrl);

  response.cookies.set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/github/setup",
    maxAge: 600,
  });

  return response;
}