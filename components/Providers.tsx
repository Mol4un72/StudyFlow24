"use client";

import React, { ReactNode } from "react";
import { ToastProvider } from "@/context/ToastContext";
import { GitHubProvider } from "@/context/GitHubContext";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <GitHubProvider>
        <AuthProvider>{children}</AuthProvider>
      </GitHubProvider>
    </ToastProvider>
  );
}
