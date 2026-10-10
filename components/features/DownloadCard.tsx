"use client";

import React, { useState } from "react";
import { Assignment } from "@/types/assignment";
import { mockArtifactService } from "@/services/mockArtifactService";
import { useToast } from "@/context/ToastContext";
import {
  Archive,
  FileText,
  Download,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DownloadCardProps {
  assignment: Assignment;
}

export function DownloadCard({ assignment }: DownloadCardProps) {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const { showToast } = useToast();

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      const ok = await mockArtifactService.generateAndDownloadZip(assignment);
      if (ok) {
        showToast({
          type: "success",
          title: "ZIP Archive Generated",
          message: "Solution files downloaded to your device.",
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "Download Failed",
        message: "Could not generate ZIP archive.",
      });
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleDownloadReport = async () => {
    setDownloadingReport(true);
    try {
      const ok = await mockArtifactService.generateAndDownloadReport(assignment);
      if (ok) {
        showToast({
          type: "success",
          title: "Report Generated",
          message: "DOCX / Lab Report downloaded. You can add screenshots before submitting.",
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "Download Failed",
        message: "Could not generate laboratory report.",
      });
    } finally {
      setDownloadingReport(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
      {/* 1. Solution Archive */}
      <div className="p-5 rounded-2xl bg-[#12151D] border border-[#222736] flex flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#191D28] border border-[#2E3547] text-[#8B5CF6] flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-100">Solution Archive</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Download the clean source code files and unit tests prepared for this assignment.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleDownloadZip}
            isLoading={downloadingZip}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download ZIP
          </Button>
        </div>
      </div>

      {/* 2. Assignment Report */}
      <div className="p-5 rounded-2xl bg-[#12151D] border border-[#222736] flex flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#191D28] border border-[#2E3547] text-indigo-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-100">Assignment Report</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Download the structured report with requirement summaries. Add your output screenshots manually before submitting.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleDownloadReport}
            isLoading={downloadingReport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download DOCX report
          </Button>
        </div>
      </div>
    </div>
  );
}
