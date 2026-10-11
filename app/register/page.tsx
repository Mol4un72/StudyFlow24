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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [connectGitHubAfter, setConnectGitHubAfter] = useState(true);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    studentGroup?: string;
    birthDate?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};

    if (!firstName.trim()) {
      errs.firstName = "Введіть ім'я.";
    }

    if (!lastName.trim()) {
      errs.lastName = "Введіть прізвище.";
    }

    if (!studentGroup.trim()) {
      errs.studentGroup = "Введіть навчальну групу.";
    }

    if (!birthDate) {
      errs.birthDate = "Вкажіть дату народження.";
    } else if (birthDate > new Date().toISOString().slice(0, 10)) {
      errs.birthDate = "Дата народження не може бути в майбутньому.";
    }

    if (!email.trim()) {
      errs.email = "Електронна пошта є обов'язковою.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Введіть коректну електронну пошту.";
    }

    if (!password) {
      errs.password = "Введіть пароль.";
    } else if (password.length < 6) {
      errs.password = "Пароль має містити щонайменше 6 символів.";
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = "Паролі не збігаються.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const ok = await register(
        firstName,
        lastName,
        studentGroup,
        birthDate,
        email,
        password
      );
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
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (errors.firstName) {
                  setErrors((prev) => ({ ...prev, firstName: undefined }));
                }
              }}
              error={errors.firstName}
              leftIcon={<UserIcon className="w-4 h-4" />}
              autoComplete="given-name"
              required
            />

            <Input
              label="Прізвище"
              type="text"
              placeholder="Введіть прізвище"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (errors.lastName) {
                  setErrors((prev) => ({ ...prev, lastName: undefined }));
                }
              }}
              error={errors.lastName}
              leftIcon={<UserIcon className="w-4 h-4" />}
              autoComplete="family-name"
              required
            />

            <Input
              label="Навчальна група"
              type="text"
              placeholder="Наприклад, КН-21"
              value={studentGroup}
              onChange={(e) => {
                setStudentGroup(e.target.value);
                if (errors.studentGroup) {
                  setErrors((prev) => ({ ...prev, studentGroup: undefined }));
                }
              }}
              error={errors.studentGroup}
              required
            />
            
            <Input
              label="Дата народження"
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                if (errors.birthDate) {
                  setErrors((prev) => ({ ...prev, birthDate: undefined }));
                }
              }}
              error={errors.birthDate}
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
