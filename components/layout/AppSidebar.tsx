"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Settings,
  LogOut,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { useAuth } from "@/context/AuthContext";
import { useGitHub } from "@/context/GitHubContext";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { connection } = useGitHub();

  const navItems = [
    {
      label: "Головна",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Нове завдання",
      href: "/tasks/new",
      icon: PlusCircle,
      active: pathname === "/tasks/new",
    },
    {
      label: "Історія",
      href: "/history",
      icon: History,
      active: pathname === "/history",
    },
    {
      label: "Налаштування",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  return (
    <aside className="w-64 bg-[#12151D] border-r border-[#222736] flex flex-col justify-between h-screen shrink-0 sticky top-0">
      {/* Top section: Brand & Nav */}
      <div className="p-4 flex flex-col gap-6">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-2 py-1.5 rounded-lg text-gray-100 hover:text-white transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-white shadow-md shadow-[#8B5CF6]/25 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              StudyFlow
            </span>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  item.active
                    ? "bg-[#191D28] text-white border border-[#2E3547] shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#191D28]/50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    item.active ? "text-[#8B5CF6]" : "text-gray-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: GitHub Status & Profile */}
      <div className="p-4 border-t border-[#222736] flex flex-col gap-3 bg-[#0E1118]/50">
        {/* GitHub Connection Badge */}
        <Link
          href="/settings#github"
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#191D28]/70 border border-[#222736] hover:border-[#2E3547] transition-all text-xs group"
        >
          <div className="flex items-center gap-2">
            <GithubIcon className="w-4 h-4 text-gray-300 shrink-0" />
            <div className="flex flex-col">
              <span className="text-gray-300 font-medium leading-none">GitHub</span>
              <span className="text-[11px] text-gray-500 mt-1">
                {connection.isConnected ? `@${connection.username}` : "Not connected"}
              </span>
            </div>
          </div>
          <div>
            {connection.isConnected ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>Connect</span>
              </span>
            )}
          </div>
        </Link>

        {/* User profile */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#191D28] border border-[#2E3547] flex items-center justify-center text-xs font-semibold text-gray-200 shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "ST"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-200 truncate">
                {user?.name || "Alex Student"}
              </p>
              <p className="text-[11px] text-gray-500 truncate">
                {user?.email || "alex@university.edu"}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
