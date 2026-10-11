import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
        githubUsername: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      isConnected: Boolean(connection),
      username: connection?.githubUsername ?? null,
      avatarUrl: connection?.avatarUrl ?? null,
      connectedAt: connection?.createdAt.toISOString() ?? null,
      scopes: [],
    });
  } catch (error) {
    console.error("Failed to load GitHub connection:", error);
    
    return NextResponse.json(
      {
        error: "Не вдалося перевірити підключення GitHub",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}