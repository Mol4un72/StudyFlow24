"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { RepositorySelector } from "@/components/features/RepositorySelector";
import { useGitHub } from "@/context/GitHubContext";
import { useToast } from "@/context/ToastContext";
import { Repository } from "@/types/github";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowRight,
  BookOpen,
  GitBranch,
  GitCommit,
  FolderGit2,
} from "lucide-react";

const SUBJECT_OPTIONS = [
  "Веб-розробка",
  "Програмування",
  "Бази даних",
];

export default function NewAssignmentPage() {
  const router = useRouter();
  const { repositories } = useGitHub();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [selectedRepoId, setSelectedRepoId] = useState<string>("");
  const [branchName, setBranchName] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

  const [generateReport, setGenerateReport] = useState(false);
  const [generateArchive, setGenerateArchive] = useState(false);

  const [errors, setErrors] = useState<{
    subject?: string;
    customSubject?: string;
    repository?: string;
    instructions?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRepo = repositories.find((r) => r.id === selectedRepoId);

  const isProgramming = subject === "Програмування";
  const isWebDevelopment = subject === "Веб-розробка";
  const isDatabases = subject === "Бази даних";

  const validate = () => {
    const errs: typeof errors = {};

    if (!subject) {
      errs.subject = "Вкажіть навчальну дисципліну.";
    }

    if (subject === "Інше" && !customSubject.trim()) {
      errs.customSubject = "Введіть назву предмету.";
    }

    if (!selectedRepoId) {
      errs.repository = "Оберіть репозиторій для публікації.";
    }

    if (!instructions.trim()) {
      errs.instructions = "Вставте текст завдання для агента.";
    } else if (instructions.trim().length < 20) {
      errs.instructions = "Завдання занадто коротке. Введіть щонайменше 20 символів.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!selectedRepo) {
      setErrors((prev) => ({ ...prev, repository: "Вибраний репозиторій недоступний." }));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          customSubject: subject === "Інше" ? customSubject : undefined,
          repositoryId: selectedRepo.id,
          repositoryName: selectedRepo.fullName,
          branchName: branchName.trim() || undefined,
          commitMessage: commitMessage.trim() || undefined,
          instructions,
          additionalContext: additionalContext.trim() || undefined,
          outputOptions: {
            separateBranch: subject !== "Бази даних",
            generateReport:
              subject === "Програмування" && generateReport,
            generateArchive:
              subject === "Програмування" && generateArchive,
          },
        }),
      });
    
      const newAssignment = await response.json();
    
      if (!response.ok) {
        throw new Error(
          newAssignment.error || "Не вдалося створити завдання"
        );
      }
    
      showToast({
        type: "success",
        title: "Завдання створено",
        message: "Завдання збережено в базі даних.",
      });
    
      router.push(`/tasks/${newAssignment.id}`);
    } catch (e) {
      console.error("Failed to create assignment:", e);
    
      showToast({
        type: "error",
        title: "Помилка надсилання",
        message:
          e instanceof Error
            ? e.message
            : "Неможливо створити завдання.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Головна", href: "/dashboard" },
        { label: "Нове завдання" },
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-8 text-left">
        {/* Page Header */}
        <div className="border-b border-[#222736] pb-5 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Нове завдання
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Вкажіть предмет, репозиторій, назву гілки та текст завдання для ШІ агента.
              </p>
            </div>
          </div>
        </div>

        {/* Main Creation Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* SECTION 1 — SUBJECT */}
          <section className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1E2330]">
              <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/20 text-[#A78BFA] font-mono text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                Предмет
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Дисципліна"
                options={SUBJECT_OPTIONS}
                value={subject}
                onChange={(e) => {
                  const nextSubject = e.target.value;

                  setSubject(nextSubject);

                  if (nextSubject !== "Програмування") {
                    setGenerateReport(false);
                    setGenerateArchive(false);
                  }
                
                  if (errors.subject) {
                    setErrors((prev) => ({
                      ...prev,
                      subject: undefined,
                    }));
                  }
                }}
                error={errors.subject}
                leftIcon={<BookOpen className="w-4 h-4" />}
                required
              />
            </div>
          </section>

          {/* SECTION 2 — GITHUB REPOSITORY & BRANCH */}
          <section className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1E2330]">
              <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/20 text-[#A78BFA] font-mono text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                Репозиторій та параметри гілки
              </h2>
            </div>

            <RepositorySelector
              selectedRepositoryId={selectedRepoId}
              onSelect={(repo: Repository) => {
                setSelectedRepoId(repo.id);
                if (errors.repository) setErrors((prev) => ({ ...prev, repository: undefined }));
              }}
              error={errors.repository}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1E2330]">
              <Input
                label="Назва гілки"
                placeholder={
                  isDatabases
                    ? "Використовується поточна гілка репозиторію"
                    : "напр. practice-04-solution"
                }
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                leftIcon={<GitBranch className="w-4 h-4 text-purple-400" />}
                hint={
                  isDatabases
                    ? "Для баз даних агент працює в поточній гілці"
                    : "Гілка буде створена агентом автоматично"
                }
                disabled={isDatabases}
              />

              <Input
                label="Назва коміту"
                placeholder="напр. Виконання практичної роботи №4"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                leftIcon={<GitCommit className="w-4 h-4 text-emerald-400" />}
                hint="Повідомлення до коміту зі змінами"
              />
            </div>
          </section>

          {/* SECTION 3 — ASSIGNMENT INSTRUCTIONS */}
          <section className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1E2330]">
              <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/20 text-[#A78BFA] font-mono text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                Завдання
              </h2>
            </div>

            <Textarea
              label="Опис та вимоги до завдання"
              placeholder="Вставте повний опис завдання, вимоги викладача, очікуваний результат тощо..."
              value={instructions}
              onChange={(e) => {
                setInstructions(e.target.value);
                if (errors.instructions)
                  setErrors((prev) => ({ ...prev, instructions: undefined }));
              }}
              onClear={() => setInstructions("")}
              showCharCount
              minCharLength={20}
              error={errors.instructions}
              className="min-h-[160px]"
              required
            />

            <div className="pt-2">
              <Input
                label="Додаткові вимоги / Варіант (необов'язково)"
                placeholder="напр. Варіант 7, використати тільки стандартні бібліотеки"
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
              />
            </div>

            {isProgramming && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <label className="flex items-start gap-3 rounded-xl border border-[#222736] bg-[#0E1118] p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateReport}
                    onChange={(e) => setGenerateReport(e.target.checked)}
                    className="mt-1 accent-violet-500"
                  />
                  <span>
                    <span className="block text-sm font-medium text-gray-200">
                      Створити звіт
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">
                      Агент сформує звіт про виконання завдання.
                    </span>
                  </span>
                </label>
                        
                <label className="flex items-start gap-3 rounded-xl border border-[#222736] bg-[#0E1118] p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateArchive}
                    onChange={(e) => setGenerateArchive(e.target.checked)}
                    className="mt-1 accent-violet-500"
                  />
                  <span>
                    <span className="block text-sm font-medium text-gray-200">
                      Створити папку з файлами
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">
                      Результати виконання будуть зібрані в окремій папці.
                    </span>
                  </span>
                </label>
              </div>
            )}
          </section>

          {/* SECTION 4 — SUBMISSION SUMMARY & START */}
          <section className="p-6 rounded-2xl bg-[#151924] border border-[#2E3547] space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#222736]">
              <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/20 text-[#A78BFA] font-mono text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                Підсумок
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0E1118] border border-[#222736]">
                <span className="text-gray-500 block mb-1">Предмет</span>
                <span className="font-semibold text-gray-200 font-mono">
                  {subject === "Інше" && customSubject ? customSubject : subject}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0E1118] border border-[#222736]">
                <span className="text-gray-500 block mb-1">Репозиторій</span>
                <span className="font-semibold text-gray-200 font-mono truncate block">
                  {selectedRepo ? selectedRepo.fullName : "Не вибрано"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0E1118] border border-[#222736]">
                <span className="text-gray-500 block mb-1">Цільова гілка</span>
                <span className="font-semibold text-purple-300 font-mono truncate block">
                  {isDatabases
                    ? "Поточна гілка репозиторію"
                    : branchName || "Буде визначена агентом"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
                disabled={!instructions.trim() || !selectedRepoId}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Запустити виконання агентом
              </Button>
            </div>
          </section>
        </form>
      </div>
    </AppLayout>
  );
}
