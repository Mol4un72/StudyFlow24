"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockTaskService } from "@/services/mockTaskService";
import { Assignment, AssignmentStatus } from "@/types/assignment";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  ArrowRight,
  FolderGit2,
  Calendar,
  Trash2,
  GitBranch,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function HistoryPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const { showToast } = useToast();

  const loadAssignments = () => {
    const data = mockTaskService.getAssignments();
    setAssignments(data);
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Видалити завдання "${title}"?`)) {
      mockTaskService.deleteAssignment(id);
      loadAssignments();
      showToast({
        type: "info",
        title: "Завдання видалено",
        message: `Видалено ${title} з робочого простору.`,
      });
    }
  };

  // Filter and sort logic
  const filteredAssignments = assignments
    .filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.instructions.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.repositoryName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSubject =
        selectedSubject === "all" ||
        a.subject.toLowerCase() === selectedSubject.toLowerCase();

      const matchStatus =
        selectedStatus === "all" ||
        a.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchSubject && matchStatus;
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

  // Unique subjects for filter
  const subjects = Array.from(new Set(assignments.map((a) => a.subject)));

  return (
    <AppLayout
      breadcrumbs={[{ label: "Головна", href: "/dashboard" }, { label: "Історія завдань" }]}
      action={
        <Link href="/tasks/new">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Нове завдання
          </Button>
        </Link>
      }
    >
      <div className="space-y-6 text-left max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Історія завданнь</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Переглядайте історію та статус ваших завдань.
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-[#12151D] border border-[#222736] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Шукайте за назвою..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-[#191D28] border border-[#2E3547] text-xs text-gray-200 placeholder:text-gray-500 rounded-xl focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30"
              />
            </div>

            {/* Subject Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full h-10 px-3 bg-[#191D28] border border-[#2E3547] text-xs text-gray-200 rounded-xl focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
              >
                <option value="all">Всі предмети</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-10 px-3 bg-[#191D28] border border-[#2E3547] text-xs text-gray-200 rounded-xl focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
              >
                <option value="all">Всі статуси</option>
                <option value="completed">Виконані</option>
                <option value="review">Очікуючі перегляду</option>
                <option value="processing">В процесі</option>
                <option value="queued">В черзі</option>
                <option value="draft">Чернетки</option>
              </select>
            </div>

            {/* Sort Toggle */}
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                className="w-full h-10 px-3 bg-[#191D28] hover:bg-[#212634] border border-[#2E3547] text-xs text-gray-300 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                <span>{sortOrder === "newest" ? "Newest first" : "Oldest first"}</span>
              </button>
            </div>
          </div>

          {/* Active filter pills summary */}
          {(searchQuery || selectedSubject !== "all" || selectedStatus !== "all") && (
            <div className="flex items-center gap-2 pt-2 border-t border-[#1E2330] text-xs text-gray-400">
              <span>Фільтрація:</span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded bg-[#191D28] text-gray-200 border border-[#2E3547]">
                  "{searchQuery}"
                </span>
              )}
              {selectedSubject !== "all" && (
                <span className="px-2 py-0.5 rounded bg-[#191D28] text-gray-200 border border-[#2E3547]">
                  Предмет: {selectedSubject}
                </span>
              )}
              {selectedStatus !== "all" && (
                <span className="px-2 py-0.5 rounded bg-[#191D28] text-gray-200 border border-[#2E3547]">
                  Статус: {selectedStatus}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("all");
                  setSelectedStatus("all");
                }}
                className="text-[#8B5CF6] hover:underline ml-auto"
              >
                Очистити всі фільтри
              </button>
            </div>
          )}
        </div>

        {/* Results List */}
        {filteredAssignments.length === 0 ? (
          <EmptyState
            title="Нічого не знайдено за вашими фільтрами."
            description="Очистіть чи оберіть інші фільтри."
            actionLabel="Очистити фільтри"
            onAction={() => {
              setSearchQuery("");
              setSelectedSubject("all");
              setSelectedStatus("all");
            }}
          />
        ) : (
          <div className="divide-y divide-[#1E222D] rounded-2xl bg-[#12151D] border border-[#222736] overflow-hidden">
            {filteredAssignments.map((asg) => (
              <div
                key={asg.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#191D28]/60 transition-all group"
              >
                <Link
                  href={`/tasks/${asg.id}`}
                  className="space-y-2 min-w-0 flex-1 block"
                >
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
                      {new Date(asg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E222D]">
                  <StatusBadge status={asg.status} />

                  <Link href={`/tasks/${asg.id}`}>
                    <Button variant="secondary" size="sm">
                      Відкрити завдання
                    </Button>
                  </Link>

                  <button
                    onClick={(e) => handleDelete(asg.id, asg.title, e)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete record"
                    aria-label="Delete assignment record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
