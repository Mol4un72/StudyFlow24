"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  GitBranch,
  FileCheck2,
  FolderGit2,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { HeroProductPreview } from "@/components/landing/HeroProductPreview";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D12] text-gray-100">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#191D28_1px,transparent_1px),linear-gradient(to_bottom,#191D28_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#191D28] border border-[#2E3547] text-xs text-gray-300">
                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="font-medium">Designed for Engineering & CS Students</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                Your coursework. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#6366F1]">
                  One streamlined workflow.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
                Organize technical assignments, prepare solutions, publish changes to GitHub, and keep your reports in one place.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link href="/register">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Get started
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    See how it works
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#1F2432] flex flex-wrap items-center gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No direct main-branch commits
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Full code review before publishing
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Self-submission workflow
                </span>
              </div>
            </div>

            {/* Right Hero Product Preview */}
            <div className="lg:col-span-6">
              <HeroProductPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 bg-[#0E1118]/80 border-y border-[#1E2330]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-widest">
              Core Capabilities
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-gray-100">
              Built for precision, safety, and academic integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* 1. Work with existing repos */}
            <div className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-4 hover:border-[#2E3547] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#191D28] border border-[#2E3547] text-[#8B5CF6] flex items-center justify-center">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100">
                1. Work with your existing repositories
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Connect your GitHub account and target your actual course repositories. Solutions are created on dedicated branches so your main branch stays untouched.
              </p>
            </div>

            {/* 2. Track every assignment */}
            <div className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-4 hover:border-[#2E3547] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#191D28] border border-[#2E3547] text-indigo-400 flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100">
                2. Track every assignment
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Filter and inspect coursework by subject, status, or date. Follow asynchronous multi-stage execution with detailed validation test logs.
              </p>
            </div>

            {/* 3. Keep code and reports together */}
            <div className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-4 hover:border-[#2E3547] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#191D28] border border-[#2E3547] text-emerald-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100">
                3. Keep code and reports together
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Download ready-to-use solution archives and pre-formatted DOCX laboratory reports. Add your own execution screenshots and submit independently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works 3-Step Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-widest">
              Execution Lifecycle
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-gray-100">
              From assignment prompt to verified branch in 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative">
            <div className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-3 relative">
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA] font-mono text-sm font-bold flex items-center justify-center">
                01
              </div>
              <h4 className="text-base font-semibold text-gray-100">
                Select Subject & Paste Prompt
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Select your academic subject, pick a target repository, and paste the coursework instructions from your university portal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-3 relative">
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA] font-mono text-sm font-bold flex items-center justify-center">
                02
              </div>
              <h4 className="text-base font-semibold text-gray-100">
                AI Agent Solves & Runs Checks
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                The agent inspects repo structure, drafts implementation files, executes automated unit tests, and presents a complete diff.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12151D] border border-[#222736] space-y-3 relative">
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA] font-mono text-sm font-bold flex items-center justify-center">
                03
              </div>
              <h4 className="text-base font-semibold text-gray-100">
                Review, Publish & Download
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Confirm publishing to create a single commit on your feature branch. Download the ZIP archive and lab report for submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clear Architecture Note */}
      <section id="architecture" className="py-14 bg-[#0E1118] border-t border-[#1E2330]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#191D28] border border-[#2E3547] text-xs text-gray-400">
            <Cpu className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Developer Note</span>
          </div>
          <h3 className="text-xl font-bold text-gray-200">
            Transparent Prototype Architecture
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            This application is an interactive frontend prototype. All backend operations—including simulated GitHub OAuth, multi-stage task execution, and repository branching—are managed through decoupled mock service layers with browser-level persistence and real client-side file generators.
          </p>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-b from-[#0B0D12] to-[#12151D] text-center border-t border-[#1E2330]">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to streamline your technical coursework?
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Experience the full student workflow from assignment submission to branch publication and report generation.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get started with StudyFlow
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
