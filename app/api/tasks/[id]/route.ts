import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Завдання не знайдено" },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Failed to fetch task:", error);

    return NextResponse.json(
      { error: "Не вдалося отримати завдання" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Завдання не знайдено" },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: {
        id: task.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Завдання видалено",
    });
  } catch (error) {
    console.error("Failed to delete task:", error);

    return NextResponse.json(
      { error: "Не вдалося видалити завдання" },
      { status: 500 }
    );
  }
}