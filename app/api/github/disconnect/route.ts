import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
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
    await prisma.gitHubConnection.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "GitHub відключено",
    });
  } catch (error) {
    console.error("Failed to disconnect GitHub:", error);

    return NextResponse.json(
      { error: "Не вдалося відключити GitHub" },
      { status: 500 }
    );
  }
}