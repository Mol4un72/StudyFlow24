"use client";

import { useCallback, useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  RefreshCw,
  Search,
  ShieldCheck,
  ShieldBan,
  CalendarClock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  accessUntil: string | null;
  isBlocked: boolean;
};

type UserAction = "grant30" | "block" | "unblock";

function getAccessStatus(user: AdminUser) {
  if (user.isBlocked) {
    return { label: "Заблоковано", color: "text-red-400" };
  }

  if (!user.accessUntil) {
    return { label: "Немає доступу", color: "text-gray-400" };
  }

  if (new Date(user.accessUntil).getTime() <= Date.now()) {
    return { label: "Термін завершився", color: "text-amber-400" };
  }

  return { label: "Активний", color: "text-emerald-400" };
}

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не вдалося завантажити користувачів.");
      }

      setUsers(data.users);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Сталася невідома помилка.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function handleAction(
    targetUser: AdminUser,
    action: UserAction,
  ) {
    const actionLabels: Record<UserAction, string> = {
      grant30: "надати або продовжити доступ на 7 днів",
      block: "заблокувати користувача",
      unblock: "розблокувати користувача",
    };

    if (
      !window.confirm(
        `Підтвердити дію: ${actionLabels[action]}?\n\n${targetUser.email}`,
      )
    ) {
      return;
    }

    setBusyUserId(targetUser.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/admin/users/${encodeURIComponent(targetUser.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не вдалося змінити доступ.");
      }

      setNotice(
        action === "grant30"
          ? `Доступ користувача ${targetUser.email} продовжено.`
          : action === "block"
            ? `Користувача ${targetUser.email} заблоковано.`
            : `Користувача ${targetUser.email} розблоковано.`,
      );

      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Сталася невідома помилка.",
      );
    } finally {
      setBusyUserId(null);
    }
  }

  const filteredUsers = users.filter((item) => {
    const query = search.trim().toLowerCase();

    return (
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query)
    );
  });

  const activeCount = users.filter(
    (item) =>
      !item.isBlocked &&
      item.accessUntil !== null &&
      new Date(item.accessUntil).getTime() > Date.now(),
  ).length;

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Головна", href: "/dashboard" },
        { label: "Адміністрування" },
      ]}
    >
      <div className="mx-auto max-w-6xl space-y-6 text-left">
        <div className="flex flex-col justify-between gap-4 border-b border-[#222736] pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#8B5CF6]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
                Адміністрування
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">
              Керування доступом
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Надавай доступ користувачам після підтвердження оплати.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadUsers()}
            disabled={loading}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#2E3547] bg-[#191D28] px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-[#222736] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Оновити
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{error}</p>
              {error.includes("прав") && (
                <p className="mt-1 text-xs text-red-400/80">
                  Увійди під акаунтом, email якого вказано в ADMIN_EMAIL.
                </p>
              )}
            </div>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-4 text-sm text-emerald-300"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{notice}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#222736] bg-[#12151D] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#8B5CF6]/10 p-3">
                <Users className="h-5 w-5 text-[#A78BFA]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Усього користувачів</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? "—" : users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#222736] bg-[#12151D] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Активний доступ</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? "—" : activeCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#222736] bg-[#12151D]">
          <div className="flex flex-col gap-4 border-b border-[#222736] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-white">Користувачі</h2>
              <p className="mt-1 text-xs text-gray-500">
                Доступ можна продовжувати кілька разів.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Пошук за ім'ям або email"
                aria-label="Пошук користувачів"
                className="min-h-10 w-full rounded-xl border border-[#2E3547] bg-[#0E1118] py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400">
              Завантаження користувачів…
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">
              {users.length === 0
                ? "Користувачів поки немає."
                : "За цим запитом нікого не знайдено."}
            </div>
          ) : (
            <div className="divide-y divide-[#222736]">
              {filteredUsers.map((item) => {
                const status = getAccessStatus(item);
                const busy = busyUserId === item.id;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-[#191D28]/40"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div className="min-w-0">
                        <p className="break-words font-semibold text-white">
                          {item.name || "Без імені"}
                        </p>
                        <p className="mt-1 break-all text-sm text-gray-400">
                          {item.email}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          Зареєстрований: {formatDate(item.createdAt)}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p
                          className={`inline-flex items-center gap-2 text-sm font-medium ${status.color}`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current" />
                          {status.label}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-400 sm:justify-end">
                          <CalendarClock className="h-3.5 w-3.5" />
                          Доступ до: {formatDate(item.accessUntil)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void handleAction(item, "grant30")}
                        disabled={busy || item.id === user?.id}
                        title={
                          item.id === user?.id
                            ? "Не можна змінювати власний доступ через цей список"
                            : "Додати 30 днів доступу"
                        }
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#8B5CF6] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#7C3AED] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <CalendarClock className="h-4 w-4" />
                        +7 днів
                      </button>

                      {item.isBlocked ? (
                        <button
                          type="button"
                          onClick={() => void handleAction(item, "unblock")}
                          disabled={busy || item.id === user?.id}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-800/60 px-3 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-950/40 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          Розблокувати
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void handleAction(item, "block")}
                          disabled={busy || item.id === user?.id}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-900/60 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ShieldBan className="h-4 w-4" />
                          Заблокувати
                        </button>
                      )}

                      {busy && (
                        <span className="self-center text-xs text-gray-500">
                          Обробка…
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <p className="text-xs leading-5 text-gray-500">
          Адміністративні дії перевіряються сервером. Наявність активного
          терміну доступу не скасовує блокування користувача.
        </p>
      </div>
    </AppLayout>
  );
}
