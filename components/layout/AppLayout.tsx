"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { LogIn, ShieldAlert, Clock3, Info } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  action?: ReactNode;
}

type AccessStatus = {
  allowed: boolean;
  code?: string;
  error?: string;
};

export function AppLayout({
  children,
  title,
  breadcrumbs,
  action,
}: AppLayoutProps) {
  const { user, isLoading } = useAuth();
  const [accessStatus, setAccessStatus] = useState<AccessStatus | null>(null);

  useEffect(() => {
    if (!user) {
      setAccessStatus(null);
      return;
    }

    let cancelled = false;

    const checkAccess = async () => {
      try {
        const response = await fetch("/api/access", {
          cache: "no-store",
        });

        const data = await response.json();

        if (cancelled) return;

        if (response.ok) {
          setAccessStatus(data);
        } else {
          setAccessStatus(null);
        }
      } catch (error) {
        console.error("Failed to load access status:", error);

        if (!cancelled) {
          setAccessStatus(null);
        }
      }
    };

    void checkAccess();

    // Періодично оновлюємо статус, щоб помітити зміни адміністратора.
    const interval = window.setInterval(() => {
      void checkAccess();
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center">
        <LoadingState message="Loading your workspace..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#12151D] border border-[#222736] text-center space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-gray-100">
            Session Required
          </h2>

          <p className="text-sm text-gray-400">
            Please sign in with your student account to access your
            assignments and repository integrations.
          </p>

          <div className="pt-2">
            <Link href="/login">
              <Button
                variant="primary"
                className="w-full"
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                Sign In to StudyFlow
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasAccess = accessStatus?.allowed === true;
  const accessDenied = accessStatus?.allowed === false;

  const isBlocked = accessStatus?.code === "ACCESS_BLOCKED";
  const isExpired = accessStatus?.code === "ACCESS_EXPIRED";
  const accessRequired = accessStatus?.code === "ACCESS_REQUIRED";

  const bannerTitle = isBlocked
    ? "Акаунт заблоковано"
    : isExpired
      ? "Термін доступу завершився"
      : accessRequired
        ? "Доступ ще не надано"
        : "Доступ обмежено";

  const bannerMessage = isBlocked
    ? "Адміністратор заблокував ваш доступ до платних функцій. Зверніться до адміністратора для уточнення."
    : isExpired
      ? "Ваш термін доступу закінчився. Зверніться до адміністратора, щоб продовжити його."
      : accessRequired
        ? "Для використання платних функцій необхідно отримати доступ від адміністратора."
        : accessStatus?.error ||
          "Зараз ви не можете користуватися платними функціями. Зверніться до адміністратора.";

  return (
    <div className="min-h-screen flex bg-[#0B0D12] text-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <AppHeader
          title={title}
          breadcrumbs={breadcrumbs}
          action={action}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {accessDenied && (
            <section
              role="alert"
              className={`mb-6 rounded-2xl border p-4 sm:p-5 ${
                isBlocked
                  ? "border-red-900/70 bg-red-950/30"
                  : isExpired
                    ? "border-amber-900/70 bg-amber-950/20"
                    : "border-[#5B3B91] bg-[#8B5CF6]/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 rounded-xl p-2 ${
                    isBlocked
                      ? "bg-red-500/10 text-red-400"
                      : isExpired
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-[#8B5CF6]/15 text-[#A78BFA]"
                  }`}
                >
                  {isBlocked ? (
                    <ShieldAlert className="h-5 w-5" />
                  ) : isExpired ? (
                    <Clock3 className="h-5 w-5" />
                  ) : (
                    <Info className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <h2
                    className={`font-semibold ${
                      isBlocked
                        ? "text-red-300"
                        : isExpired
                          ? "text-amber-300"
                          : "text-[#C4B5FD]"
                    }`}
                  >
                    {bannerTitle}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-300">
                    {bannerMessage}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Перегляд профілю та історії залишається доступним.
                  </p>
                </div>
              </div>
            </section>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}