"use client";

import React from "react";
import {
  GitBranch,
  CheckCircle2,
  FileText,
  Archive,
  Terminal,
  ShieldCheck,
  Download,
  FolderGit2,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function HeroProductPreview() {
  return (
    <div className="w-full rounded-2xl bg-[#12151D] border border-[#2E3547] shadow-2xl shadow-black/80 overflow-hidden text-left">
      {/* Mock Window Top Bar */}
      <div className="px-4 py-3 bg-[#161A24] border-b border-[#222736] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs font-mono text-gray-400">
            app.studyflow.io/tasks/asg-python-01/result
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            Branch Synced
          </span>
        </div>
      </div>

      {/* Main Workspace Preview Content */}
      <div className="p-5 sm:p-6 space-y-5 bg-[#0D1017]">
        {/* Assignment Header in Mockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2330]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[#8B5CF6]">Python</span>
              <span className="text-gray-600">•</span>
              <span className="text-xs text-gray-400">Lab Practice 04</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-100">
              Python — Server Access Log Processing
            </h3>
          </div>
          <StatusBadge status="completed" />
        </div>

        {/* Git & Branch Spec Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#12151D] border border-[#222736] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#191D28] text-gray-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                Target Repository
              </p>
              <p className="text-xs font-mono text-gray-200 truncate">
                student/python-course
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#12151D] border border-[#222736] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#191D28] text-[#8B5CF6]">
              <GitBranch className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                Created Branch
              </p>
              <p className="text-xs font-mono text-purple-300 truncate">
                practice-04-file-processing
              </p>
            </div>
          </div>
        </div>

        {/* Code Diff Snapshot Preview */}
        <div className="p-3.5 rounded-xl bg-[#090B0F] border border-[#1F2432] font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1A1F2C] text-gray-400 text-[11px]">
            <span className="text-gray-300">practice-04/log_parser.py</span>
            <span className="text-emerald-400 font-sans font-semibold">100% Tests Passed</span>
          </div>
          <p className="text-emerald-400">+ class LogAnalyzer:</p>
          <p className="text-emerald-400">+ &nbsp;&nbsp;&nbsp;&nbsp;def parse_access_records(self):</p>
          <p className="text-gray-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;with open(self.filepath) as f: ...</p>
          <p className="text-emerald-400">+ &nbsp;&nbsp;&nbsp;&nbsp;return summarize_peak_traffic()</p>
        </div>

        {/* Download Action Cards inside Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-[#151923] border border-[#262D3D] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="text-xs font-semibold text-gray-200">DOCX Lab Report</p>
                <p className="text-[10px] text-gray-400">Ready for student screenshots</p>
              </div>
            </div>
            <Download className="w-3.5 h-3.5 text-gray-400" />
          </div>

          <div className="p-3 rounded-xl bg-[#151923] border border-[#262D3D] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Archive className="w-4 h-4 text-[#8B5CF6]" />
              <div>
                <p className="text-xs font-semibold text-gray-200">Solution Archive</p>
                <p className="text-[10px] text-gray-400">practice-04-solution.zip</p>
              </div>
            </div>
            <Download className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
