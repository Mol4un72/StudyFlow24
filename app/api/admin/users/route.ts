import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Необхідно увійти в акаунт." },
        { status: 401 },
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (
      !adminEmail ||
      session.user.email.trim().toLowerCase() !== adminEmail
    ) {
      return NextResponse.json(
        { error: "Недостатньо прав." },
        { status: 403 },
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        accessUntil: true,
        isBlocked: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch admin users:", error);

    return NextResponse.json(
      { error: "Не вдалося отримати список користувачів." },
      { status: 500 },
    );
  }
}
