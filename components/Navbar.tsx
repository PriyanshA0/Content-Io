"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Zap, ChevronDown, Moon, SunMedium } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { LoadingLink } from "@/components/LoadingLink";
import favicon from "@/app/assets/Favicon.png";

interface NavbarProps {
  forceLightTheme?: boolean;
}

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#demo" },
  { label: "Support", href: "#support" },
  { label: "Changelog", href: "#changelog" },
];

export function Navbar({ forceLightTheme = false }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (forceLightTheme) {
      document.documentElement.dataset.theme = "light";
      document.documentElement.classList.remove("dark");
      setThemeMode("light");
      return;
    }

    const savedTheme = window.localStorage.getItem("contentio-theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";

    document.documentElement.dataset.theme = initialTheme;
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    window.setTimeout(() => setThemeMode(initialTheme), 0);
  }, [forceLightTheme]);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  const updateTheme = (nextTheme: "light" | "dark") => {
    setThemeMode(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("contentio-theme", nextTheme);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl">
      {/* Top announcement bar */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 dark:from-violet-500/5 dark:via-fuchsia-500/5 dark:to-cyan-500/5 py-1.5 text-center text-xs font-medium text-slate-600 dark:text-slate-400">
        <span className="mr-2 inline-flex items-center gap-1 rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-400">
          New
        </span>
        AI-powered style suggestions just launched →{" "}
        <a href="#features" className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white">
          Try it free
        </a>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <LoadingLink href="/" loadingLabel="Loading..." className="flex items-center gap-2.5 text-slate-900 dark:text-white">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 shadow-[0_8px_24px_rgba(168,85,247,0.28)] dark:shadow-[0_8px_24px_rgba(168,85,247,0.15)]">
            <img src={favicon.src} alt="ContentIo logo" className="h-[18px] w-[18px] object-contain" />
            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white">
            content<span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Io</span>
          </span>
        </LoadingLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <div className="relative ml-1">
            <button className="flex items-center gap-1 rounded-lg px-3.5 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
              Resources <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2.5 md:flex">
          <button
            type="button"
            onClick={() => updateTheme(themeMode === "dark" ? "light" : "dark")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50 transition hover:bg-slate-50 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {themeMode === "dark" ? <SunMedium className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {themeMode === "dark" ? "Light" : "Dark"}
          </button>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <LoadingLink
                href="/editor"
                loadingLabel="Opening..."
                className="rounded-lg px-4 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                Sign in
              </LoadingLink>
              <LoadingLink
                href="/editor"
                loadingLabel="Opening..."
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(168,85,247,0.4)] transition hover:shadow-[0_12px_32px_rgba(168,85,247,0.55)] hover:brightness-110"
              >
                <Zap className="h-3.5 w-3.5" />
                Start for free
                <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
              </LoadingLink>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-950/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
            <button
              type="button"
              onClick={() => updateTheme(themeMode === "dark" ? "light" : "dark")}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50"
            >
              {themeMode === "dark" ? "Switch to Light" : "Switch to Dark"}
            </button>
            {isSignedIn ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-center">
                <UserButton />
              </div>
            ) : (
              <>
                <LoadingLink href="/editor" loadingLabel="Opening..." className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-slate-900 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50">
                  Sign in
                </LoadingLink>
                <LoadingLink href="/editor" loadingLabel="Opening..." className="rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm">
                  Start for free
                </LoadingLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}