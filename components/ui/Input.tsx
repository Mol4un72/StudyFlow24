"use client";

import React, { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      type = "text",
      className = "",
      id,
      leftIcon,
      rightElement,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-gray-300 uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-gray-500 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            className={`w-full h-10 px-3.5 ${leftIcon ? "pl-10" : ""} ${
              isPassword || rightElement ? "pr-10" : ""
            } bg-[#12151D] border ${
              error ? "border-red-500/60 focus:border-red-500" : "border-[#222736] focus:border-[#8B5CF6]"
            } text-gray-100 placeholder:text-gray-500 text-sm rounded-xl transition-all duration-150 focus:outline-none focus:ring-1 ${
              error ? "focus:ring-red-500/30" : "focus:ring-[#8B5CF6]/30"
            } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {!isPassword && rightElement && (
            <div className="absolute right-3 flex items-center">{rightElement}</div>
          )}
        </div>

        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
