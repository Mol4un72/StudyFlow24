"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  subMessage,
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="w-10 h-10 rounded-full border-2 border-t-[#8B5CF6] border-r-[#8B5CF6]/30 border-b-transparent border-l-transparent animate-spin mb-4" />
      <p className="text-sm font-medium text-gray-200">{message}</p>
      {subMessage && (
        <p className="text-xs text-gray-400 mt-1 max-w-xs">{subMessage}</p>
      )}
    </div>
  );
}
