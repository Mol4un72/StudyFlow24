import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;
const ACCESS_DAYS = 7;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
    const body = await request.json();
    const action = body?.action;

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        accessUntil: true,
        isBlocked: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Користувача не знайдено." },
        { status: 404 },
      );
    }

    if (action === "block" && id === session.user.id) {
      return NextResponse.json(
        { error: "Не можна заблокувати власний акаунт адміністратора." },
        { status: 400 },
      );
    }

    let updatedUser;

    if (action === "grant30") {
      const now = new Date();

      const baseDate =
        targetUser.accessUntil &&
        targetUser.accessUntil.getTime() > now.getTime()
          ? targetUser.accessUntil
          : now;

      const accessUntil = new Date(
        baseDate.getTime() + ACCESS_DAYS * DAY_MS,
      );

      updatedUser = await prisma.user.update({
        where: { id },
        data: { accessUntil },
        select: {
          id: true,
          name: true,
          email: true,
          accessUntil: true,
          isBlocked: true,
        },
      });
    } else if (action === "block" || action === "unblock") {
      updatedUser = await prisma.user.update({
        where: { id },
        data: {
          isBlocked: action === "block",
        },
        select: {
          id: true,
          name: true,
          email: true,
          accessUntil: true,
          isBlocked: true,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Невідома дія." },
        { status: 400 },
      );
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Failed to update user access:", error);

    return NextResponse.json(
      { error: "Не вдалося змінити доступ користувача." },
      { status: 500 },
    );
  }
}
