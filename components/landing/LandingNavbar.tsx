"use client";

import React from "react";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export function LandingNavbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#222736]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-white shadow-md shadow-[#8B5CF6]/25 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">StudyFlow</span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-gray-100 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-gray-100 transition-colors">
            How it works
          </a>
          <a href="#architecture" className="hover:text-gray-100 transition-colors">
            Workflow
          </a>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
