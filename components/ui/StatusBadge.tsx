"use client";

import React from "react";
import { AssignmentStatus } from "@/types/assignment";
import {
  Clock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  GitPullRequest,
  FileEdit,
  Send,
} from "lucide-react";

interface StatusBadgeProps {
  status: AssignmentStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  size = "md",
  showIcon = true,
}: StatusBadgeProps) {
  const config: Record<
    AssignmentStatus,
    {
      label: string;
      bg: string;
      text: string;
      border: string;
      icon: React.ComponentType<{ className?: string }>;
      animate?: boolean;
    }
  > = {
    draft: {
      label: "Чернетка",
      bg: "bg-gray-800/60",
      text: "text-gray-300",
      border: "border-gray-700/60",
      icon: FileEdit,
    },
    queued: {
      label: "В черзі",
      bg: "bg-blue-950/40",
      text: "text-blue-300",
      border: "border-blue-800/40",
      icon: Clock,
    },
    processing: {
      label: "Виконується",
      bg: "bg-indigo-950/50",
      text: "text-indigo-300",
      border: "border-indigo-800/50",
      icon: Loader2,
      animate: true,
    },
    review: {
      label: "Очікує перегляду",
      bg: "bg-amber-950/40",
      text: "text-amber-300",
      border: "border-amber-800/50",
      icon: AlertTriangle,
    },
    publishing: {
      label: "Публікується",
      bg: "bg-purple-950/50",
      text: "text-purple-300",
      border: "border-purple-800/50",
      icon: Send,
      animate: true,
    },
    completed: {
      label: "Виконано",
      bg: "bg-emerald-950/40",
      text: "text-emerald-300",
      border: "border-emerald-800/50",
      icon: CheckCircle2,
    },
    failed: {
      label: "Провалено",
      bg: "bg-rose-950/40",
      text: "text-rose-300",
      border: "border-rose-800/50",
      icon: AlertTriangle,
    },
  };

  const item = config[status] || config.draft;
  const Icon = item.icon;

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5 gap-1.5 font-medium"
      : "text-xs px-2.5 py-1 gap-1.5 font-semibold";

  return (
    <span
      className={`inline-flex items-center rounded-full border ${item.bg} ${item.text} ${item.border} ${sizeClasses} select-none`}
    >
      {showIcon && (
        <Icon className={`w-3.5 h-3.5 shrink-0 ${item.animate ? "animate-spin" : ""}`} />
      )}
      <span>{item.label}</span>
    </span>
  );
}
