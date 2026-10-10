"use client";

import React, { TextareaHTMLAttributes, forwardRef } from "react";
import { XCircle } from "lucide-react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  showCharCount?: boolean;
  maxCharLength?: number;
  minCharLength?: number;
  onClear?: () => void;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      showCharCount = false,
      maxCharLength,
      minCharLength,
      onClear,
      value,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const currentLength = typeof value === "string" ? value.length : 0;
    const isBelowMin = minCharLength ? currentLength > 0 && currentLength < minCharLength : false;

    return (
      <div className="w-full space-y-1.5 text-left">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className="block text-xs font-semibold text-gray-300 uppercase tracking-wider"
            >
              {label}
            </label>
          )}

          {onClear && currentLength > 0 && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Clear text</span>
            </button>
          )}
        </div>

        <div className="relative">
          <textarea
            ref={ref}
            id={inputId}
            value={value}
            disabled={disabled}
            className={`w-full p-3.5 bg-[#12151D] border ${
              error || isBelowMin
                ? "border-red-500/60 focus:border-red-500"
                : "border-[#222736] focus:border-[#8B5CF6]"
            } text-gray-100 placeholder:text-gray-500 text-sm rounded-xl transition-all duration-150 focus:outline-none focus:ring-1 ${
              error || isBelowMin ? "focus:ring-red-500/30" : "focus:ring-[#8B5CF6]/30"
            } disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[140px] font-sans ${className}`}
            {...props}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div>
            {error ? (
              <p className="text-red-400 font-medium">{error}</p>
            ) : isBelowMin && minCharLength ? (
              <p className="text-amber-400">
                Minimum {minCharLength} characters required ({minCharLength - currentLength} more needed)
              </p>
            ) : hint ? (
              <p className="text-gray-500">{hint}</p>
            ) : null}
          </div>

          {showCharCount && (
            <span
              className={`font-mono tabular-nums ${
                isBelowMin ? "text-amber-400" : "text-gray-500"
              }`}
            >
              {currentLength}
              {maxCharLength ? ` / ${maxCharLength}` : " chars"}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
