"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockTaskService } from "@/services/mockTaskService";
import { Assignment } from "@/types/assignment";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import {
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  GitBranch,
  FolderGit2,
  Calendar,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAssignments = () => {
    setIsLoading(true);
    try {
      const data = mockTaskService.getAssignments();
      setAssignments(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleResetData = () => {
    if (confirm("Reset assignments to original demo state?")) {
      const reset = mockTaskService.resetToDefault();
      setAssignments(reset);
    }
  };

  const completedCount = assignments.filter((a) => a.status === "completed").length;
  const inProgressCount = assignments.filter(
    (a) => a.status !== "completed" && a.status !== "failed"
  ).length;

  return (
    <AppLayout
      breadcrumbs={[{ label: "Робоче місце", href: "/dashboard" }]}
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
      <div className="space-y-8 text-left">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              З поверненням{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Продовжіть виконувати практичні.
            </p>
          </div>
        </div>    

        {/* Recent Assignments Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-100 flex items-center gap-2">
              <span>Нещодавні завдання</span>
              <span className="text-xs font-mono text-gray-500 font-normal">
                ({assignments.length})
              </span>
            </h2>
            <Link
              href="/history"
              className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] font-medium flex items-center gap-1 transition-colors"
            >
              <span>Подивитись всю історію</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {assignments.length === 0 ? (
            <EmptyState
              title="No assignments yet"
              description="Get started by submitting your first assignment description. Our AI agent will prepare the solution and branch."
              actionLabel="Create new assignment"
              onAction={() => window.location.assign("/tasks/new")}
            />
          ) : (
            <div className="divide-y divide-[#1E222D] rounded-2xl bg-[#12151D] border border-[#222736] overflow-hidden">
              {assignments.map((asg) => (
                <Link
                  key={asg.id}
                  href={`/tasks/${asg.id}`}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#191D28]/60 transition-all group block"
                >
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#191D28] text-gray-300 border border-[#2E3547]">
                        {asg.subject}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-100 group-hover:text-white transition-colors truncate">
                        {asg.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5 font-mono text-gray-400">
                        <FolderGit2 className="w-3.5 h-3.5 text-gray-500" />
                        {asg.repositoryName}
                      </span>
                      {asg.branchName && (
                        <span className="flex items-center gap-1.5 font-mono text-purple-300/80">
                          <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                          {asg.branchName}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(asg.updatedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E222D]">
                    <StatusBadge status={asg.status} />
                    <div className="w-8 h-8 rounded-lg bg-[#191D28] border border-[#2E3547] group-hover:border-[#8B5CF6]/50 flex items-center justify-center text-gray-400 group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
