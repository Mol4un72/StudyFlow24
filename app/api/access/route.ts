import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { checkPaidAccess } from "@/lib/access";

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

    const access = await checkPaidAccess(
      session.user.id,
      session.user.email,
    );

    return NextResponse.json(access);
  } catch (error) {
    console.error("Failed to check access status:", error);

    return NextResponse.json(
      { error: "Не вдалося перевірити статус доступу." },
      { status: 500 },
    );
  }
}
