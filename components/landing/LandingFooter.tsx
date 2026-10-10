"use client";

import React from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export function LandingFooter() {
  return (
    <footer className="border-t border-[#222736] bg-[#0E1118] text-gray-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-[#8B5CF6] flex items-center justify-center text-white">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-gray-200">StudyFlow</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-500">
            Frontend Prototype & Coursework Solution Architecture
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:text-gray-200 transition-colors">
            Login
          </Link>
          <Link href="/register" className="hover:text-gray-200 transition-colors">
            Register
          </Link>
          <Link href="/dashboard" className="hover:text-gray-200 transition-colors">
            Dashboard
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-gray-200 transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub Spec</span>
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 pt-6 border-t border-[#1C202B] text-center text-gray-600">
        © {new Date().getFullYear()} StudyFlow. Designed for technical students and coursework automation.
      </div>
    </footer>
  );
}
