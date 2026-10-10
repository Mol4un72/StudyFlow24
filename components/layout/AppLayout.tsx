"use client";

import React, { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { LogIn } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  action?: ReactNode;
}

export function AppLayout({
  children,
  title,
  breadcrumbs,
  action,
}: AppLayoutProps) {
  const { user, isLoading } = useAuth();

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
          <h2 className="text-xl font-bold text-gray-100">Session Required</h2>
          <p className="text-sm text-gray-400">
            Please sign in with your student account to access your assignments and repository integrations.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button variant="primary" className="w-full" leftIcon={<LogIn className="w-4 h-4" />}>
                Sign In to StudyFlow
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0B0D12] text-gray-100">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <AppHeader title={title} breadcrumbs={breadcrumbs} action={action} />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
