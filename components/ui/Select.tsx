"use client";

import React, { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: (SelectOption | string)[];
  leftIcon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      options,
      leftIcon,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const formattedOptions: SelectOption[] = options.map((opt) =>
      typeof opt === "string" ? { value: opt, label: opt } : opt
    );

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
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

          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`w-full h-10 px-3.5 ${leftIcon ? "pl-10" : ""} pr-10 bg-[#12151D] border ${
              error ? "border-red-500/60 focus:border-red-500" : "border-[#222736] focus:border-[#8B5CF6]"
            } text-gray-100 text-sm rounded-xl appearance-none cursor-pointer transition-all duration-150 focus:outline-none focus:ring-1 ${
              error ? "focus:ring-red-500/30" : "focus:ring-[#8B5CF6]/30"
            } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          >
            <option
              value=""
              disabled
              className="bg-[#12151D] text-gray-400"
            >
              Оберіть дисципліну
            </option>
          
            {formattedOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-[#12151D] text-gray-100 py-1"
              >
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
