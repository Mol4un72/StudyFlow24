"use client";

import React, { useState } from "react";
import { Assignment, AssignmentFile } from "@/types/assignment";
import {
  FileCode,
  Plus,
  Minus,
  CheckCircle2,
  GitCommit,
  GitBranch,
  ShieldCheck,
  FileText,
  Copy,
  Check,
} from "lucide-react";

interface DiffViewerProps {
  assignment: Assignment;
}

export function DiffViewer({ assignment }: DiffViewerProps) {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile: AssignmentFile | undefined = assignment.files[selectedFileIndex];

  const handleCopyCode = () => {
    if (!activeFile) return;
    const text = activeFile.newContent || activeFile.diffPreview || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Target Branch and Commit Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#12151D] border border-[#222736] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#191D28] text-[#8B5CF6] border border-[#2E3547]">
            <GitBranch className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
              Target Branch
            </span>
            <p className="text-sm font-mono font-medium text-gray-200 truncate">
              {assignment.branchName || "practice-solution"}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#12151D] border border-[#222736] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#191D28] text-emerald-400 border border-[#2E3547]">
            <GitCommit className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
              Commit Message
            </span>
            <p className="text-sm font-medium text-gray-200 truncate">
              "{assignment.commitMessage || "Complete assignment"}"
            </p>
          </div>
        </div>
      </div>

      {/* Code Changes File Explorer & Diff Preview */}
      <div className="rounded-2xl bg-[#12151D] border border-[#222736] overflow-hidden">
        {/* Header toolbar */}
        <div className="p-4 border-b border-[#222736] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#151923]">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="text-sm font-semibold text-gray-200">
              Proposed Changes ({assignment.files.length} {assignment.files.length === 1 ? "file" : "files"})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#191D28] border border-[#2E3547] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Code"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[350px]">
          {/* File list sidebar */}
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#222736] p-3 space-y-1.5 bg-[#0E1118]/50">
            {assignment.files.map((file, idx) => {
              const isSelected = idx === selectedFileIndex;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-[#191D28] text-white border border-[#2E3547]"
                      : "text-gray-400 hover:bg-[#151922] hover:text-gray-200"
                  }`}
                >
                  <span className="truncate flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    {file.path}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-sans font-bold uppercase shrink-0 ${
                      file.action === "added"
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                        : file.action === "modified"
                        ? "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                        : "bg-rose-950/60 text-rose-400 border border-rose-800/40"
                    }`}
                  >
                    {file.action}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Diff Preview Body */}
          <div className="md:col-span-8 p-4 bg-[#090B0F] overflow-x-auto">
            {activeFile ? (
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E222D] text-xs font-mono text-gray-400">
                  <span>{activeFile.path}</span>
                  <span>{activeFile.sizeBytes ? `${activeFile.sizeBytes} bytes` : ""}</span>
                </div>
                <pre className="text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto whitespace-pre">
                  {activeFile.newContent || activeFile.diffPreview}
                </pre>
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center py-12">
                No file selected.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Validation Checklist Results */}
      <div className="p-4 rounded-xl bg-[#12151D] border border-[#222736] space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">
            Automated Validation Summary
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {assignment.validationChecks.map((chk) => (
            <div
              key={chk.id}
              className="p-3 rounded-lg bg-[#191D28]/60 border border-[#2E3547] text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-medium">
                <span className="text-gray-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {chk.title}
                </span>
                <span className="text-emerald-400 font-mono text-[10px] uppercase">
                  {chk.status}
                </span>
              </div>
              <p className="text-gray-400 text-[11px]">{chk.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
