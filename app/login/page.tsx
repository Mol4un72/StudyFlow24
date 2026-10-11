"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers, Mail, Lock, ArrowRight, Shield } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = "Електронна пошта є обов'язковим полем.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Введіть коректну електронну пошту.";
    }

    if (!password) {
      errs.password = "Пароль є обов'язковим полем.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const success = await login(email, password, rememberMe);
      if (success) {
        router.push("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] flex flex-col justify-between text-gray-100 p-4 sm:p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-white shadow-md shadow-[#8B5CF6]/25">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-white">StudyFlow</span>
        </Link>
        <Link
          href="/register"
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Потрібен акаунт? <span className="text-[#8B5CF6] font-semibold">Зареєструватись</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#12151D] border border-[#222736] shadow-2xl space-y-6 text-left">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">Вхід</h1>
            <p className="text-xs text-gray-400">
              Отримуйте доступ до навчальних завдань, репозиторіїв та сформованих звітів.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Електронна пошта"
              type="email"
              placeholder="name@gmail.com"
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
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#2E3547] bg-[#191D28] text-[#8B5CF6] focus:ring-[#8B5CF6]/30"
                />
                <span>Запам'ятати мене</span>
              </label>

              <button
                type="button"
                onClick={() => alert("Prototype mode: Use the demo credentials to sign in directly.")}
                className="text-xs text-[#8B5CF6] hover:underline"
              >
                Забули пароль?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              size="md"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Увійти
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs text-gray-600 max-w-md mx-auto">
        StudyFlow Coursework Organization Platform • Prototype
      </div>
    </div>
  );
}
