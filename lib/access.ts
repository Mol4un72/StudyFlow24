import { prisma } from "@/lib/prisma";

type AccessCheck =
  | { allowed: true }
  | { allowed: false; code: string; error: string };

export async function checkPaidAccess(
  userId: string,
  email: string,
): Promise<AccessCheck> {
  // Адміністратор має доступ незалежно від підписки.
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (
    adminEmail &&
    email.trim().toLowerCase() === adminEmail
  ) {
    return { allowed: true };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      accessUntil: true,
      isBlocked: true,
    },
  });

  if (!user) {
    return {
      allowed: false,
      code: "USER_NOT_FOUND",
      error: "Користувача не знайдено.",
    };
  }

  if (user.isBlocked) {
    return {
      allowed: false,
      code: "ACCESS_BLOCKED",
      error: "Ваш доступ заблоковано.",
    };
  }

  if (!user.accessUntil) {
    return {
      allowed: false,
      code: "ACCESS_REQUIRED",
      error: "Для використання сервісу потрібно отримати доступ від адміністратора.",
    };
  }

  if (user.accessUntil.getTime() <= Date.now()) {
    return {
      allowed: false,
      code: "ACCESS_EXPIRED",
      error: "Термін вашого доступу закінчився.",
    };
  }

  return { allowed: true };
}