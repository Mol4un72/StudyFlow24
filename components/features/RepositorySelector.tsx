"use client";

import React, { useState } from "react";
import { Repository } from "@/types/github";
import { useGitHub } from "@/context/GitHubContext";
import {
  GitFork,
  Lock,
  Globe,
  RefreshCw,
  Search,
  Check,
  AlertCircle,
  Star,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

interface RepositorySelectorProps {
  selectedRepositoryId?: string;
  onSelect: (repo: Repository) => void;
  error?: string;
}

export function RepositorySelector({
  selectedRepositoryId,
  onSelect,
  error,
}: RepositorySelectorProps) {
  const { connection, repositories, isLoading, refreshRepositories, connectGitHub, isConnecting } =
    useGitHub();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = repositories.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRepo = repositories.find((r) => r.id === selectedRepositoryId);

  if (!connection.isConnected) {
    return (
      <div className="p-5 rounded-2xl bg-[#12151D] border border-[#2E3547] space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#191D28] border border-[#2E3547] text-amber-400 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-200">GitHub Account Required</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Connect your GitHub account to access your repositories. In this frontend prototype, a simulated OAuth connection will be activated.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => connectGitHub()}
            isLoading={isConnecting}
            leftIcon={<GithubIcon className="w-4 h-4" />}
          >
            Connect GitHub (Simulated)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <GithubIcon className="w-3.5 h-3.5 text-gray-300" />
            <span>@{connection.username}</span>
          </span>
          <button
            type="button"
            onClick={refreshRepositories}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-200 p-1 hover:bg-[#191D28] rounded-md transition-colors"
            title="Refresh repository list"
            aria-label="Refresh repository list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#8B5CF6]" : ""}`} />
          </button>
        </div>
      </div>

      {/* List of repositories */}
      <div className="grid grid-cols-1 gap-2 max-h-58 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500 bg-[#12151D]/40 rounded-xl border border-dashed border-[#222736]">
            No repositories found matching "{searchQuery}"
          </div>
        ) : (
          filtered.map((repo) => {
            const isSelected = repo.id === selectedRepositoryId;
            return (
              <div
                key={repo.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(repo)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(repo);
                  }
                }}
                className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer text-left flex items-start justify-between gap-3 ${
                  isSelected
                    ? "bg-[#191D28] border-[#8B5CF6] shadow-sm shadow-[#8B5CF6]/10"
                    : "bg-[#12151D] border-[#222736] hover:border-[#2E3547] hover:bg-[#151922]"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-100 truncate">
                      {repo.fullName}
                    </span>
                    {repo.isPrivate ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                        <Lock className="w-2.5 h-2.5" /> Private
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                        <Globe className="w-2.5 h-2.5" /> Public
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{repo.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                      {repo.language}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3 text-gray-500" />
                      {repo.defaultBranch}
                    </span>
                    {repo.stars > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        {repo.stars}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? "bg-[#8B5CF6] border-[#8B5CF6] text-white"
                        : "border-[#2E3547] bg-transparent"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
}
