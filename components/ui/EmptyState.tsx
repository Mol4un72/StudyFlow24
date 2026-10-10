"use client";

import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[#222736] bg-[#12151D]/60 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-[#191D28] border border-[#2E3547] flex items-center justify-center text-[#8B5CF6] mb-4">
        {icon || <FolderOpen className="w-6 h-6 text-gray-400" />}
      </div>
      <h3 className="text-base font-semibold text-gray-200 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
