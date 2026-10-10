"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers, Mail, Lock, User as UserIcon, ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useGitHub } from "@/context/GitHubContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const { connectGitHub } = useGitHub();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [connectGitHubAfter, setConnectGitHubAfter] = useState(true);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) {
      errs.name = "Ім'я є обов'язковим полем.";
    }

    if (!email.trim()) {
      errs.email = "Електронна пошта є обов'язковим полем.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Введіть існуючу пошту.";
    }

    if (!password) {
      errs.password = "Пароль є обов'язковим полем.";
    } else if (password.length < 6) {
      errs.password = "Пароль має мати щонайменше 6 символів.";
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = "Паролі не зходяться.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const ok = await register(name, email, password);
      if (ok) {
        router.push("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] flex flex-col justify-between text-gray-100 p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-white shadow-md shadow-[#8B5CF6]/25">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-white">StudyFlow</span>
        </Link>
        <Link
          href="/login"
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Вже маєте акаунт? <span className="text-[#8B5CF6] font-semibold">Увійти</span>
        </Link>
      </div>

      {/* Main Form */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#12151D] border border-[#222736] shadow-2xl space-y-6 text-left">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">Створіть акаунт</h1>
            <p className="text-xs text-gray-400">
              Почніть упорядковувати завдання з програмування та публікувати якісні рішення.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Ім'я"
              type="text"
              placeholder="Введіть ім'я"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
              leftIcon={<UserIcon className="w-4 h-4" />}
              autoComplete="name"
              required
            />

            <Input
              label="Електронна пошта"
              type="email"
              placeholder="Введіть електронну пошту"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <Input
              label="Пароль"
              type="password"
              placeholder="Введіть щонайменше 6 символів"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="new-password"
              required
            />

            <Input
              label="Повторіть пароль"
              type="password"
              placeholder="Введіть ваш пароль ще раз"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              size="md"
              isLoading={isSubmitting || isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
