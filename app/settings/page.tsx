"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { useGitHub } from "@/context/GitHubContext";
import { useToast } from "@/context/ToastContext";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { mockTaskService } from "@/services/mockTaskService";
import {
  User,
  Sliders,
  LogOut,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Save,
  Shield,
  GitBranch,
  FileText,
  Archive,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

const SUBJECT_OPTIONS = [
  "Web Development",
  "JavaScript",
  "Python",
  "Databases",
  "Operating Systems",
  "Computer Networks",
];

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const { connection, connectGitHub, disconnectGitHub, isConnecting } = useGitHub();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [defaultSubject, setDefaultSubject] = useState(
    user?.preferences?.defaultSubject || "Python"
  );
  const [separateBranch, setSeparateBranch] = useState(
    user?.preferences?.separateBranch ?? true
  );
  const [generateReport, setGenerateReport] = useState(
    user?.preferences?.generateReport ?? true
  );
  const [generateArchive, setGenerateArchive] = useState(
    user?.preferences?.generateArchive ?? true
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.preferences) {
        setDefaultSubject(user.preferences.defaultSubject || "Python");
        setSeparateBranch(user.preferences.separateBranch ?? true);
        setGenerateReport(user.preferences.generateReport ?? true);
        setGenerateArchive(user.preferences.generateArchive ?? true);
      }
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        email,
        preferences: {
          defaultSubject,
          separateBranch,
          generateReport,
          generateArchive,
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout
      breadcrumbs={[{ label: "Головна", href: "/dashboard" }, { label: "Налаштування" }]}
    >
      <div className="max-w-4xl mx-auto space-y-8 text-left">
        {/* Header */}
        <div className="border-b border-[#222736] pb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Акаунт і налаштування</h1>
          <p className="text-sm text-gray-400 mt-1">
            Керуйте своїм особистим профілем, підключенням до репозиторію та налаштуваннями навчальних курсів.
          </p>
        </div>

        {/* 1. PROFILE SECTION */}
        <section className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E2330]">
            <User className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
              Профіль
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                required
              />

              <Input
                label="Електронна пошта"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@university.edu"
                required
              />
            </div>

            <div className="flex pt-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSaving}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Зберегти налаштування
              </Button>
            </div>
          </form>
        </section>

        {/* 2. GITHUB CONNECTION SECTION */}
        <section id="github" className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2330]">
            <div className="flex items-center gap-2">
              <GithubIcon className="w-4 h-4 text-[#8B5CF6]" />
              <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                Підключення GitHub
              </h2>
            </div>

            {connection.isConnected ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <CheckCircle2 className="w-3.5 h-3.5" /> Підключено
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/40">
                <AlertCircle className="w-3.5 h-3.5" /> Відключено
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#191D28]/60 border border-[#2E3547] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-200">
                {connection.isConnected
                  ? `Підключено як @${connection.username}`
                  : "GitHub не підключено"}
              </p>
              <p className="text-xs text-gray-400">
                {connection.isConnected
                  ? `Надає доступ до 3 навчальних репозиторіїв курсів із правами на відправку змін у гілки (push).`
                  : `Додайте репозиторії для роботи.`}
              </p>
            </div>

            <div className="shrink-0">
              {connection.isConnected ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => disconnectGitHub()}
                  isLoading={isConnecting}
                >
                  Відключити GitHub
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => connectGitHub()}
                  isLoading={isConnecting}
                  leftIcon={<GithubIcon className="w-4 h-4" />}
                >
                  Підключити GitHub
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* 4. ACCOUNT & DEMO ACTIONS */}
        <section className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E2330]">
            <LogOut className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
              Сесія
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-200">Вийти</h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Завершити сеанс та вийти з акаунту.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => logout()}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Вийти
            </Button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
