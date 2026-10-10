"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockTaskService } from "@/services/mockTaskService";
import { mockArtifactService } from "@/services/mockArtifactService";
import { Assignment } from "@/types/assignment";
import { FileList } from "@/components/features/FileList";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/context/ToastContext";
import {
  GitBranch,
  GitCommit,
  FolderGit2,
  Download,
  Archive,
  FileText,
  CheckCircle2,
  Loader2,
  Plus,
  ArrowLeft,
  Calendar,
  Sparkles,
  FileCode,
} from "lucide-react";

export default function TaskViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;
  const router = useRouter();
  const { showToast } = useToast();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);

  // Load assignment data
  const loadAssignment = useCallback(() => {
    try {
      const data = mockTaskService.getAssignmentById(taskId);
      setAssignment(data);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadAssignment();
  }, [loadAssignment]);

  // Automated stage progression: the AI agent performs execution, validation, and branch push automatically
  useEffect(() => {
    if (!assignment) return;

    if (assignment.status !== "completed" && assignment.status !== "failed") {
      const timer = setTimeout(async () => {
        const updated = await mockTaskService.advanceStage(assignment.id);
        if (updated) {
          setAssignment(updated);
          if (updated.status === "completed") {
            showToast({
              type: "success",
              title: "Завдання успішно виконано!",
              message: "Агент запушив код у гілку. Папка та звіт готові.",
            });
          }
        }
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [assignment, showToast]);

  const handleDownloadZip = async () => {
    if (!assignment) return;
    setDownloadingZip(true);
    try {
      const ok = await mockArtifactService.generateAndDownloadZip(assignment);
      if (ok) {
        showToast({
          type: "success",
          title: "ZIP-архів завантажено",
          message: "Папку з файлами розв'язку збережено.",
        });
      }
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!assignment) return;
    setDownloadingReport(true);
    try {
      const ok = await mockArtifactService.generateAndDownloadReport(assignment);
      if (ok) {
        showToast({
          type: "success",
          title: "Звіт завантажено",
          message: "DOCX звіт завантажено. Додайте скриншоти перед здачею.",
        });
      }
    } finally {
      setDownloadingReport(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingState message="Завантаження завдання..." />
      </AppLayout>
    );
  }

  if (!assignment) {
    return (
      <AppLayout>
        <EmptyState
          title="Завдання не знайдено"
          description={`Завдання з ID ${taskId} не знайдено в системі.`}
          actionLabel="До списку завдань"
          onAction={() => router.push("/dashboard")}
        />
      </AppLayout>
    );
  }

  const isExecuting = assignment.status !== "completed" && assignment.status !== "failed";
  const currentStage = assignment.stages[assignment.currentStageIndex - 1];

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Головна", href: "/dashboard" },
        { label: "Завдання", href: "/history" },
        { label: assignment.title },
      ]}
      action={
        <div className="flex items-center gap-2">
          <Link href="/tasks/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Нове завдання
            </Button>
          </Link>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6 text-left">
        {/* Top Header Card */}
        <div className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 font-medium">
                  {assignment.subject}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  ID: {assignment.id}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {assignment.title}
              </h1>
            </div>

            <StatusBadge status={assignment.status} />
          </div>

          {/* Metadata Row: Repo, Branch, Commit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#1E222D] text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-gray-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-gray-500 block uppercase">Репозиторій</span>
                <span className="font-mono text-gray-200 truncate block">
                  {assignment.repositoryName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-gray-500 block uppercase">Гілка (Branch)</span>
                <span className="font-mono text-purple-300 truncate block">
                  {assignment.branchName || "practice-solution"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-gray-500 block uppercase">Коміт</span>
                <span className="text-gray-200 truncate block">
                  {assignment.commitMessage || "Виконання практичної"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* IN-PROGRESS STATE: Agent is executing and pushing */}
        {isExecuting && (
          <div className="p-8 rounded-2xl bg-[#12151D] border border-[#8B5CF6]/40 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#191D28] border border-[#8B5CF6]/50 flex items-center justify-center mx-auto text-[#8B5CF6]">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-semibold text-white">
                ШІ агент виконує завдання та пушить у гілку
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {currentStage?.message || "Обробка вимог, генерація коду, запуск перевірок та пуш у GitHub..."}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono pt-2">
              <span>Етап {assignment.currentStageIndex} з 7</span>
              <span>•</span>
              <span className="text-purple-400">{currentStage?.title}</span>
            </div>
          </div>
        )}

        {/* COMPLETED STATE: Deliverables (Folder with solution + Separate report file) */}
        {!isExecuting && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Main Deliverables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Folder with completed assignment files */}
              <div className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] hover:border-[#2E3547] transition-all flex flex-col justify-between gap-5 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#191D28] border border-[#2E3547] text-[#8B5CF6] flex items-center justify-center">
                      <Archive className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Готово
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">Папка з виконаними завданнями</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      ZIP-архів з усіма файлами розв'язку, структурою каталогів та README.
                    </p>
                  </div>
                </div>

                <div>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={handleDownloadZip}
                    isLoading={downloadingZip}
                    leftIcon={<Download className="w-4 h-4" />}
                  >
                    Завантажити архів (.ZIP)
                  </Button>
                </div>
              </div>

              {/* 2. Separate Report File */}
              <div className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] hover:border-[#2E3547] transition-all flex flex-col justify-between gap-5 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#191D28] border border-[#2E3547] text-indigo-400 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Сформовано
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">Окремий файл зі звітом</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Готовий лабораторний звіт (DOCX). Завантажте, додайте власні скриншоти та надішліть викладачу.
                    </p>
                  </div>
                </div>

                <div>
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={handleDownloadReport}
                    isLoading={downloadingReport}
                    leftIcon={<Download className="w-4 h-4" />}
                  >
                    Завантажити звіт (.DOCX)
                  </Button>
                </div>
              </div>
            </div>

            {/* Generated Files & Code Explorer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Виконані файли розв'язку ({assignment.files.length})</span>
                </h3>
                <span className="text-xs text-gray-500 font-mono">
                  Гілка: {assignment.branchName}
                </span>
              </div>

              <FileList files={assignment.files} />
            </div>

            {/* Task Prompt Overview */}
            <div className="p-5 rounded-2xl bg-[#12151D] border border-[#222736] space-y-3 text-xs">
              <h4 className="font-semibold text-gray-300 uppercase tracking-wider">
                Умова завдання
              </h4>
              <div className="p-3.5 rounded-xl bg-[#090B0F] border border-[#1E222D] text-gray-300 font-sans leading-relaxed whitespace-pre-line">
                {assignment.instructions}
              </div>
              {assignment.additionalContext && (
                <p className="text-gray-400">
                  <strong>Додаткові вимоги:</strong> {assignment.additionalContext}
                </p>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#222736]">
              <Link href="/history">
                <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  До списку завдань
                </Button>
              </Link>

              <Link href="/tasks/new">
                <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  Створити нове завдання
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
