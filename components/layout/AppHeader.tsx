"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Plus,
  Layers,
  LayoutDashboard,
  PlusCircle,
  History,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useGitHub } from "@/context/GitHubContext";

interface AppHeaderProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  action?: React.ReactNode;
}

export function AppHeader({ title, breadcrumbs, action }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { connection } = useGitHub();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "New assignment", href: "/tasks/new", icon: PlusCircle },
    { label: "History", href: "/history", icon: History },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#222736] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Left: Mobile hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-200 hover:bg-[#191D28] rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Breadcrumbs or Page Title */}
          <div>
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav className="flex items-center gap-1.5 text-xs text-gray-400" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-600" />}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-gray-200 transition-colors truncate max-w-[150px] sm:max-w-xs"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-gray-200 font-medium truncate max-w-[150px] sm:max-w-xs">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            ) : title ? (
              <h1 className="text-base font-semibold text-gray-100">{title}</h1>
            ) : null}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {action ? (
            action
          ) : pathname !== "/tasks/new" ? (
            <Link href="/tasks/new">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                <span className="hidden sm:inline">Нове завдання</span>
                <span className="sm:hidden">New</span>
              </Button>
            </Link>
          ) : null}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-72 bg-[#12151D] border-r border-[#222736] p-5 flex flex-col justify-between z-50">
            <div className="space-y-6">
              {/* Mobile Brand */}
              <div className="flex items-center justify-between pb-4 border-b border-[#222736]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#8B5CF6] flex items-center justify-center text-white">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white tracking-tight">StudyFlow</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                        isActive
                          ? "bg-[#191D28] text-white border border-[#2E3547]"
                          : "text-gray-400 hover:text-white hover:bg-[#191D28]/40"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#8B5CF6]" : ""}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Profile in drawer */}
            <div className="pt-4 border-t border-[#222736] space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <GithubIcon className="w-4 h-4" />
                  {connection.isConnected ? `@${connection.username}` : "GitHub disconnected"}
                </span>
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#8B5CF6] hover:underline"
                >
                  Configure
                </Link>
              </div>

              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-200 truncate">{user?.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="p-2 text-gray-400 hover:text-red-400"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
