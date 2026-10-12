"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockArtifactService } from "@/services/mockArtifactService";
import { Assignment } from "@/types/assignment";
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

  const loadAssignment = useCallback(
    async (showLoader = false) => {
      if (showLoader) {
        setIsLoading(true);
      }

      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 404) {
            setAssignment(null);
            return;
          }

          throw new Error("Не вдалося завантажити завдання");
        }

        const task = await response.json();

        const data: Assignment = {
          id: task.id,
          title: task.title,
          subject: task.subject,
          customSubject: task.customSubject ?? undefined,
          repositoryId: task.repositoryId,
          repositoryName: task.repositoryFullName,
          instructions: task.assignmentText,
          additionalContext: task.additionalContext ?? undefined,
          status: task.status,
          currentStageIndex: task.currentStageIndex,
          stages: Array.isArray(task.stages) ? task.stages : [],
          branchName: task.branchName ?? undefined,
          commitMessage: task.commitMessage ?? undefined,
          commitSha: task.commitSha ?? undefined,
          simulatedRepoUrl: task.simulatedRepoUrl ?? undefined,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          publishedAt: task.publishedAt ?? undefined,
          files: Array.isArray(task.files) ? task.files : [],
          validationChecks: Array.isArray(task.validationChecks)
            ? task.validationChecks
            : [],
          outputOptions: task.outputOptions ?? {
            separateBranch: true,
            generateReport: true,
            generateArchive: true,
          },
          reportStatus: task.reportStatus,
          archiveStatus: task.archiveStatus,
          errorDetails: task.errorDetails ?? undefined,
        };

        setAssignment(data);
      } catch (error) {
        console.error("Failed to load assignment:", error);
        setAssignment(null);

        showToast({
          type: "error",
          title: "Помилка завантаження",
          message: "Не вдалося завантажити завдання з сервера.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [taskId, showToast],
  );

  useEffect(() => {
    void loadAssignment(true);
  }, [loadAssignment]);

  useEffect(() => {
    if (
      !assignment ||
      assignment.status === "completed" ||
      assignment.status === "failed"
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadAssignment();
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [assignment?.status, assignment, loadAssignment]);

  const handleDownloadZip = async () => {
    if (!assignment) return;

    setDownloadingZip(true);

    try {
      const ok =
        await mockArtifactService.generateAndDownloadZip(assignment);

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
      const ok =
        await mockArtifactService.generateAndDownloadReport(assignment);

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

  const isExecuting =
    assignment.status === "queued" || assignment.status === "running";

  const stages = Array.isArray(assignment.stages)
  ? assignment.stages
  : [];

  const currentStage = stages[assignment.currentStageIndex - 1];

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
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Нове завдання
            </Button>
          </Link>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6 text-left">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#1E222D] text-xs text-gray-400">
            {/* Repository */}
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-gray-500 shrink-0" />

              <div className="min-w-0">
                <span className="text-[10px] text-gray-500 block uppercase">
                  Репозиторій
                </span>

                <a
                  href={`https://github.com/${assignment.repositoryName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-gray-200 truncate block hover:text-purple-400 transition-colors"
                >
                  {assignment.repositoryName}
                </a>
              </div>
            </div>

            {/* Branch */}
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-400 shrink-0" />

              <div className="min-w-0">
                <span className="text-[10px] text-gray-500 block uppercase">
                  Гілка (Branch)
                </span>

                {assignment.branchName ? (
                  <a
                    href={`https://github.com/${assignment.repositoryName}/tree/${encodeURIComponent(assignment.branchName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-purple-300 truncate block hover:text-purple-200 transition-colors"
                  >
                    {assignment.branchName}
                  </a>
                ) : (
                  <span className="text-gray-500">Не вказано</span>
                )}
              </div>
            </div>
              
            {/* Commit */}
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-emerald-400 shrink-0" />
              
              <div className="min-w-0">
                <span className="text-[10px] text-gray-500 block uppercase">
                  Коміт
                </span>
              
                {assignment.commitSha ? (
                  <a
                    href={`https://github.com/${assignment.repositoryName}/commit/${encodeURIComponent(assignment.commitSha)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 truncate block hover:text-emerald-400 transition-colors"
                    title={assignment.commitMessage}
                  >
                    {assignment.commitMessage || assignment.commitSha.slice(0, 7)}
                  </a>
                ) : (
                  <span
                    className="text-gray-500 truncate block"
                    title={assignment.commitMessage}
                  >
                    {assignment.commitMessage || "Коміт ще не створено"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {isExecuting && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#12151D] border border-[#8B5CF6]/40 space-y-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#191D28] border border-[#8B5CF6]/50 flex items-center justify-center text-[#8B5CF6] shrink-0">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-semibold text-white">
                  ШІ-агент виконує завдання
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  {currentStage?.message ||
                    "Очікуємо на початок виконання..."}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  Етап {assignment.currentStageIndex} із {stages.length}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {stages.map((stage, index) => {
                const completed = stage.status === "completed";
                const running = stage.status === "running";
                const failed = stage.status === "failed";
                const skipped = stage.status === "skipped";

                let statusLabel = "Очікує";
                let statusClass = "text-gray-500";

                if (completed) {
                  statusLabel = "Завершено";
                  statusClass = "text-emerald-400";
                } else if (running) {
                  statusLabel = "Виконується";
                  statusClass = "text-purple-400";
                } else if (failed) {
                  statusLabel = "Помилка";
                  statusClass = "text-red-400";
                } else if (skipped) {
                  statusLabel = "Пропущено";
                  statusClass = "text-gray-500";
                }

                return (
                  <div
                    key={stage.id ?? `${stage.title}-${index}`}
                    className={`flex items-start gap-3 rounded-xl border p-3 ${
                      running
                        ? "border-purple-500/30 bg-purple-500/5"
                        : failed
                          ? "border-red-500/30 bg-red-500/5"
                          : "border-[#222736] bg-[#0E1118]"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#191D28] flex items-center justify-center shrink-0">
                      {completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : running ? (
                        <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      ) : failed ? (
                        <span className="text-red-400 text-sm font-bold">
                          !
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 font-medium">
                        {stage.title}
                      </p>

                      {running && (
                        <p className="text-xs text-gray-400 mt-1">
                          {stage.message}
                        </p>
                      )}
                    </div>

                    <span className={`text-xs shrink-0 ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {assignment.status === "failed" && (
          <div className="p-6 rounded-2xl bg-[#12151D] border border-red-500/30 space-y-3">
            <h3 className="text-base font-semibold text-red-400">
              Не вдалося виконати завдання
            </h3>

            <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
              {assignment.errorDetails ||
                "Сталася невідома помилка під час виконання."}
            </p>

            <Link href="/history">
              <Button variant="secondary" size="sm">
                До списку завдань
              </Button>
            </Link>
          </div>
        )}

        {assignment.status === "completed" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] hover:border-[#2E3547] transition-all flex flex-col justify-between gap-5 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#191D28] border border-[#2E3547] text-[#8B5CF6] flex items-center justify-center">
                      <Archive className="w-5 h-5" />
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Готово
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">
                      Папка з виконаними завданнями
                    </h3>

                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      ZIP-архів з усіма файлами розв'язку, структурою каталогів
                      та README.
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

              <div className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] hover:border-[#2E3547] transition-all flex flex-col justify-between gap-5 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#191D28] border border-[#2E3547] text-indigo-400 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Сформовано
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">
                      Окремий файл зі звітом
                    </h3>

                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Готовий лабораторний звіт (DOCX). Завантажте, додайте
                      власні скриншоти та надішліть викладачу.
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#8B5CF6]" />
                  <span>
                    Виконані файли розв'язку ({assignment.files.length})
                  </span>
                </h3>

                <span className="text-xs text-gray-500 font-mono">
                  Гілка: {assignment.branchName}
                </span>
              </div>

            </div>

            <div className="p-5 rounded-2xl bg-[#12151D] border border-[#222736] space-y-3 text-xs">
              <h4 className="font-semibold text-gray-300 uppercase tracking-wider">
                Умова завдання
              </h4>

              <div className="p-3.5 rounded-xl bg-[#090B0F] border border-[#1E222D] text-gray-300 font-sans leading-relaxed whitespace-pre-line">
                {assignment.instructions}
              </div>

              {assignment.additionalContext && (
                <p className="text-gray-400">
                  <strong>Додаткові вимоги:</strong>{" "}
                  {assignment.additionalContext}
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#222736]">
              <Link href="/history">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  До списку завдань
                </Button>
              </Link>

              <Link href="/tasks/new">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
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