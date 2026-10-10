"use client";

import React from "react";
import { Assignment, AssignmentStageInfo } from "@/types/assignment";
import {
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  FileCheck,
  GitBranch,
  ShieldCheck,
  FileCode,
  Search,
  FileText,
  Terminal,
} from "lucide-react";

interface ExecutionStepperProps {
  assignment: Assignment;
  isSimulating?: boolean;
}

export function ExecutionStepper({ assignment }: ExecutionStepperProps) {
  const getStageIcon = (key: string) => {
    switch (key) {
      case "received":
        return FileCheck;
      case "inspected":
        return Search;
      case "prepared":
        return FileCode;
      case "validation":
        return ShieldCheck;
      case "review":
        return Terminal;
      case "publishing":
        return GitBranch;
      case "report":
        return FileText;
      default:
        return FileCheck;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[17px] sm:before:left-[21px] before:top-3 before:bottom-3 before:w-0.5 before:bg-[#222736]">
        {assignment.stages.map((stage, idx) => {
          const StageIcon = getStageIcon(stage.key);
          const isCurrent = stage.status === "running";
          const isDone = stage.status === "completed";
          const isFailed = stage.status === "failed";
          const isPending = stage.status === "pending";

          return (
            <div
              key={stage.id}
              className={`relative flex items-start gap-4 transition-all duration-300 ${
                isPending ? "opacity-50" : "opacity-100"
              }`}
            >
              {/* Stepper Node Icon */}
              <div
                className={`absolute -left-6 sm:-left-8 w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 z-10 ${
                  isDone
                    ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400"
                    : isCurrent
                    ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#8B5CF6] shadow-md shadow-[#8B5CF6]/25 animate-pulse"
                    : isFailed
                    ? "bg-rose-950/60 border-rose-500/50 text-rose-400"
                    : "bg-[#12151D] border-[#2E3547] text-gray-500"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isFailed ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <StageIcon className="w-4 h-4" />
                )}
              </div>

              {/* Stage Content Card */}
              <div
                className={`flex-1 p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-[#191D28] border-[#8B5CF6]/50 shadow-sm"
                    : isDone
                    ? "bg-[#12151D] border-[#222736]"
                    : "bg-[#12151D]/50 border-[#1E222D]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#8B5CF6]">0{idx + 1}.</span>
                    <h4 className="text-sm font-semibold text-gray-100">{stage.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {stage.timestamp && (
                      <span className="text-[11px] font-mono text-gray-500">
                        {new Date(stage.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30">
                        In Progress
                      </span>
                    )}
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  {stage.message || stage.description}
                </p>

                {/* Validation check specifics during validation stage */}
                {stage.key === "validation" && (isDone || isCurrent) && (
                  <div className="mt-3 pt-3 border-t border-[#222736] space-y-1.5">
                    {assignment.validationChecks.map((chk) => (
                      <div
                        key={chk.id}
                        className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-[#0E1118]/70 border border-[#222736]"
                      >
                        <span className="text-gray-300 font-mono flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          {chk.title}
                        </span>
                        <span className="text-[11px] text-gray-500 font-mono">
                          {chk.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
