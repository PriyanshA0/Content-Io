"use client";

import { useEffect, useState } from "react";
import { Menu, X, Zap, ChevronDown, Moon, SunMedium } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";
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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when a link is clicked and page scrolls
  useEffect(() => {
    if (!mobileOpen) return;
    const handleScroll = () => setMobileOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

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
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl">

      {/* ── Announcement bar ── */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 dark:from-violet-500/5 dark:via-fuchsia-500/5 dark:to-cyan-500/5 py-1.5 text-center text-[11px] font-medium text-slate-600 dark:text-slate-400 px-4">
        <span className="mr-1.5 inline-flex items-center gap-1 rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-500/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-400">
          New
        </span>
        {/* Hide long text on very small screens */}
        <span className="hidden xs:inline">AI-powered style suggestions just launched → </span>
        <a
          href="#features"
          className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white"
        >
          Try it free
        </a>
      </div>

      {/* ── Main nav row ── */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <LoadingLink
          href="/"
          loadingLabel="Loading..."
          className="flex shrink-0 items-center gap-2 text-slate-900 dark:text-white"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 shadow-[0_6px_20px_rgba(168,85,247,0.3)]">
            <img
              src={favicon.src}
              alt="ContentIo logo"
              className="h-[16px] w-[16px] object-contain"
            />
            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            content
            <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Io
            </span>
          </span>
        </LoadingLink>

        {/* Desktop centre nav — hidden below md */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white">
            Resources <ChevronDown className="h-3 w-3" />
          </button>
        </nav>

        {/* Desktop right side — hidden below md */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => updateTheme(themeMode === "dark" ? "light" : "dark")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-medium text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {themeMode === "dark" ? (
              <SunMedium className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
            <span className="hidden lg:inline">
              {themeMode === "dark" ? "Light" : "Dark"}
            </span>
          </button>

          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <LoadingLink
                href="/editor"
                loadingLabel="Opening..."
                className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                Sign in
              </LoadingLink>
              <LoadingLink
                href="/editor"
                loadingLabel="Opening..."
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_6px_20px_rgba(168,85,247,0.4)] transition hover:brightness-110"
              >
                <Zap className="h-3.5 w-3.5" />
                Start for free
                <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
              </LoadingLink>
            </>
          )}
        </div>

        {/* Mobile right side: theme icon + hamburger */}
        <div className="flex items-center gap-1.5 md:hidden">
          {/* Compact theme toggle — icon only on mobile */}
          <button
            type="button"
            onClick={() => updateTheme(themeMode === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {themeMode === "dark" ? (
              <SunMedium className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer — animated slide-down ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white/98 dark:bg-slate-950/98 px-4 pb-5 pt-3">
          {/* Nav links */}
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <button className="flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 text-left">
              Resources <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </nav>

          {/* Divider + CTAs */}
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 dark:border-slate-700 pt-3">
            {isSignedIn ? (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3">
                <UserButton />
                <span className="text-sm text-slate-600 dark:text-slate-400">My Account</span>
              </div>
            ) : (
              <>
                <LoadingLink
                  href="/editor"
                  loadingLabel="Opening..."
                  className="block rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-slate-900 dark:text-slate-200 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </LoadingLink>
                <LoadingLink
                  href="/editor"
                  loadingLabel="Opening..."
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:brightness-110"
                  onClick={() => setMobileOpen(false)}
                >
                  <Zap className="h-4 w-4" />
                  Start for free
                </LoadingLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}