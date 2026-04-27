"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 shadow-[0_12px_30px_rgba(168,85,247,0.35)]">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="text-base">ContentIo</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#demo" className="transition hover:text-white">
            Demo
          </a>
          <a href="#pricing" className="transition hover:text-white">
            Pricing
          </a>
          <a href="#footer" className="transition hover:text-white">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/editor" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
            Login
          </Link>
          <Link href="/editor" className="rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(168,85,247,0.35)] transition hover:brightness-110">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
