"use client";

import React, { useState } from "react";
import { AssignmentFile } from "@/types/assignment";
import { FileCode, FileText, Eye, Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface FileListProps {
  files: AssignmentFile[];
}

export function FileList({ files }: FileListProps) {
  const [inspectingFile, setInspectingFile] = useState<AssignmentFile | null>(null);

  return (
    <>
      <div className="rounded-2xl bg-[#12151D] border border-[#222736] overflow-hidden text-left">
        <div className="p-4 border-b border-[#222736] bg-[#151923] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-sm font-semibold text-gray-200">Generated Files & Manifest</span>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            {files.length} {files.length === 1 ? "file" : "files"}
          </span>
        </div>

        <div className="divide-y divide-[#1E222D]">
          {files.map((file) => (
            <div
              key={file.path}
              className="p-3.5 flex items-center justify-between hover:bg-[#191D28]/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-mono font-medium text-gray-200 truncate">
                    {file.path}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] font-sans font-bold uppercase ${
                        file.action === "added"
                          ? "text-emerald-400"
                          : file.action === "modified"
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      [{file.action}]
                    </span>
                    {file.sizeBytes && (
                      <span className="text-[10px] text-gray-500 font-mono">
                        {file.sizeBytes} B
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInspectingFile(file)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Inspect
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Inspect file modal */}
      {inspectingFile && (
        <Modal
          isOpen={!!inspectingFile}
          onClose={() => setInspectingFile(null)}
          title={inspectingFile.path}
          description={`Action: ${inspectingFile.action.toUpperCase()} • ${
            inspectingFile.sizeBytes ? `${inspectingFile.sizeBytes} bytes` : ""
          }`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#090B0F] border border-[#222736] overflow-x-auto">
              <pre className="text-xs font-mono text-gray-300 leading-relaxed whitespace-pre">
                {inspectingFile.newContent || inspectingFile.diffPreview || "// No content preview available"}
              </pre>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setInspectingFile(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
