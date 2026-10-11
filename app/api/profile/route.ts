import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Необхідно увійти в акаунт." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName =
      typeof body.lastName === "string" ? body.lastName.trim() : "";
    const studentGroup =
      typeof body.studentGroup === "string"
        ? body.studentGroup.trim()
        : "";
    const birthDate =
      typeof body.birthDate === "string" ? body.birthDate : "";

    if (!firstName || !lastName || !studentGroup || !birthDate) {
      return NextResponse.json(
        { error: "Заповніть усі поля профілю." },
        { status: 400 }
      );
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(birthDate) ||
      !Number.isFinite(Date.parse(`${birthDate}T00:00:00Z`)) ||
      new Date(`${birthDate}T00:00:00Z`).toISOString().slice(0, 10) !==
        birthDate
    ) {
      return NextResponse.json(
        { error: "Вкажіть коректну дату народження." },
        { status: 400 }
      );
    }

    if (birthDate > new Date().toISOString().slice(0, 10)) {
      return NextResponse.json(
        { error: "Дата народження не може бути в майбутньому." },
        { status: 400 }
      );
    }

    const name = `${firstName} ${lastName}`;

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        firstName,
        lastName,
        studentGroup,
        birthDate,
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        studentGroup: true,
        birthDate: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Failed to update profile:", error);

    return NextResponse.json(
      { error: "Не вдалося зберегти профіль." },
      { status: 500 }
    );
  }
}