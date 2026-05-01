"use client";

import React, { useState, useRef, useMemo, useEffect, forwardRef } from 'react';
import Link from 'next/link';
import { SignInButton, UserButton, useAuth, useClerk } from '@clerk/nextjs';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight, coldarkDark, materialOceanic, synthwave84 } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { toPng } from 'html-to-image';
import { 
  FileCode2, 
  ImagePlus, 
  Save, 
  Download, 
  LoaderCircle, 
  Sparkles,
  ShieldCheck, 
  HeartHandshake,
  CloudUpload,
  Menu,
  Zap,
  Shield,
  Eye,
  ArrowLeft,
  Moon,
  SunMedium,
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { LoadingLink } from './LoadingLink';
import favicon from '@/app/assets/Favicon.png';

/** * TYPES & CONSTANTS 
 */
const starterCode = `const product = "ContentIo";

function launch() {
  return {
    headline: "Ship polished content fast",
    vibe: "glass + gradients + social-ready exports",
  };
}

console.log(launch());`;

const backgroundMap = {
  aurora: "linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #22d3ee 100%)",
  sunset: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
  midnight: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
  emerald: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
  graphite: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  glass: "rgba(255, 255, 255, 0.05)",
};

export type Background = keyof typeof backgroundMap;
export type Theme = "dark" | "light" | "neon" | "ocean" | "sunset";
export type Layout = "centered" | "framed" | "card";
export type AspectRatio = "auto" | "1:1" | "16:9" | "4:5";
export type Mode = "image" | "code";
type EditorLanguage = "javascript" | "typescript" | "python" | "bash" | "java" | "cpp";

const themeStyles = {
  dark: vscDarkPlus,
  light: oneLight,
  neon: synthwave84,
  ocean: materialOceanic,
  sunset: coldarkDark,
} as const;

/**
 * SUB-COMPONENTS
 */

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("contentio-theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";

    document.documentElement.dataset.theme = initialTheme;
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    window.setTimeout(() => setThemeMode(initialTheme), 0);
  }, []);

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
      <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 dark:from-violet-500/5 dark:via-fuchsia-500/5 dark:to-cyan-500/5 py-1.5 text-center text-[10px] font-medium text-slate-600 dark:text-slate-400">
        <span className="mr-2 inline-flex items-center gap-1 rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-500/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-400">New</span>
        AI-powered style suggestions just launched → <span className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white cursor-pointer">Try it free</span>
      </div>
      <div className="mx-auto w-full flex max-w-7xl items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
          <LoadingLink href="/" loadingLabel="Back..." className="inline-flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft className="h-5 w-5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" />
            <span className="hidden sm:inline text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Back</span>
          </LoadingLink>
          <span className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></span>
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400">
            <img src={favicon.src} alt="ContentIo logo" className="h-4 w-4 object-contain" />
          </span>
          <span className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-white">content<span className="text-fuchsia-400">Io</span></span>
        </div>
        <nav className="hidden items-center gap-1 md:flex">
          {["Features", "Demo", "Support"].map(link => (
            <span key={link} className="rounded-lg px-3 py-2 text-[12px] font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer">{link}</span>
          ))}
        </nav>
        <div className="hidden items-center gap-2.5 md:flex">
          <button
            type="button"
            onClick={() => updateTheme(themeMode === "dark" ? "light" : "dark")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {themeMode === "dark" ? <SunMedium className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {themeMode === "dark" ? "Light" : "Dark"}
          </button>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <LoadingLink
              href="/"
              loadingLabel="Opening..."
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-4 py-2 text-[12px] font-semibold text-white shadow-lg transition hover:brightness-110"
            >
              <Zap className="h-3.5 w-3.5" />
              Start for free
            </LoadingLink>
          )}
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-slate-500 dark:text-slate-400"><Menu /></button>
      </div>
    </header>
  );
};

interface SliderRowProps {
  label: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (next: number) => void;
  tone?: "fuchsia" | "cyan";
}

const SliderRow = ({
  label,
  valueLabel,
  value,
  min,
  max,
  step,
  onChange,
  tone = "fuchsia",
}: SliderRowProps) => {
  const progress = ((value - min) / (max - min)) * 100;
  const activeColor = tone === "cyan" ? "#22d3ee" : "#d946ef";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
      <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        <span>{label}</span>
        <span className="font-mono text-[10px] text-slate-300">{valueLabel}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="studio-slider"
        style={{
          background: `linear-gradient(90deg, ${activeColor} 0%, ${activeColor} ${progress}%, rgba(148, 163, 184, 0.28) ${progress}%, rgba(148, 163, 184, 0.18) 100%)`,
        }}
      />
    </div>
  );
};

interface SimpleSyntaxHighlighterProps {
  code: string;
  theme: Theme;
  fontSize: number;
  language: EditorLanguage;
}

const SimpleSyntaxHighlighter = ({ code, theme, fontSize, language }: SimpleSyntaxHighlighterProps) => {
  return (
    <div className="preview-code overflow-hidden rounded-b-[inherit]">
      <SyntaxHighlighter
        language={language}
        style={themeStyles[theme]}
        showLineNumbers
        wrapLines
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          fontSize: `${fontSize}px`,
          background: "transparent",
          lineHeight: "1.6",
        }}
        lineNumberStyle={{
          opacity: 0.2,
          minWidth: "2.5em",
          paddingRight: "1em",
          backgroundColor: "transparent",
          textAlign: "right",
          userSelect: "none",
        }}
        codeTagProps={{
          style: {
            backgroundColor: "transparent",
          },
        }}
        lineProps={() => ({
          style: {
            display: "block",
            backgroundColor: "transparent",
          },
        })}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

interface PreviewCardProps {
  mode: Mode;
  imageUrl: string | null;
  code: string;
  background: Background;
  padding: number;
  radius: number;
  shadow: boolean;
  theme: Theme;
  fontSize: number;
  language: EditorLanguage;
  watermark: boolean;
  opacity: number;
  tiltX: number;
  tiltY: number;
  showWindowButtons: boolean;
  cardTitle: string;
  aspectRatio: AspectRatio;
  borderWidth: number;
}

const PreviewCard = forwardRef<HTMLDivElement, PreviewCardProps>(({ 
  mode, imageUrl, code, background, padding, radius, shadow, theme, 
  fontSize, language, watermark, opacity, tiltX, tiltY, 
  showWindowButtons, cardTitle, aspectRatio, borderWidth
}, ref) => {
  const borderRadius = `${radius}px`;
  const innerRadius = `${Math.max(radius - 12, 8)}px`;
  
  const aspectStyle = {
    "auto": "w-full",
    "1:1": "aspect-square flex items-center justify-center",
    "16:9": "aspect-video flex items-center justify-center",
    "4:5": "aspect-[4/5] flex items-center justify-center",
  }[aspectRatio];

  const surfaceBg = theme === "light" 
    ? `rgba(255, 255, 255, ${opacity})` 
    : `rgba(2, 6, 23, ${opacity})`;

  const textCol = theme === "light" ? "text-slate-800" : "text-white";

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        ref={ref}
        className={`${aspectStyle} overflow-hidden transition-all duration-300 shadow-2xl`}
        style={{
          padding: `${padding}px`,
          background: backgroundMap[background] || backgroundMap.aurora,
        }}
      >
        <div
          className="relative w-full border border-white/10 backdrop-blur-xl transition-transform duration-500 ease-out"
          style={{
            borderRadius,
            boxShadow: shadow ? "0 40px 100px rgba(0, 0, 0, 0.5)" : "none",
            background: surfaceBg,
            borderWidth: `${borderWidth}px`,
            transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              {showWindowButtons && (
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
              )}
              <span className={`text-[10px] font-medium opacity-50 ${textCol}`}>{cardTitle}</span>
            </div>
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 opacity-60" />
          </div>

          <div className="overflow-hidden">
            {mode === "image" && imageUrl ? (
              <div className="p-4">
                <img src={imageUrl} alt="Preview" className="w-full h-auto object-contain" style={{ borderRadius: innerRadius }} />
              </div>
            ) : (
              <SimpleSyntaxHighlighter code={code} theme={theme} fontSize={fontSize} language={language} />
            )}
          </div>

          {watermark && (
            <div className="absolute bottom-3 right-4 flex items-center gap-1.5 opacity-30">
              <Sparkles className="h-2.5 w-2.5" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">ContentIo</span>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
});

/**
 * MAIN APP
 */

export function EditorStudio() {
  const { isSignedIn, userId } = useAuth();
  const { openSignIn } = useClerk();
  const [appTheme, setAppTheme] = useState<"light" | "dark">("light");

  const [mode, setMode] = useState<Mode>("image");
  const [code, setCode] = useState(starterCode);
  const [language, setLanguage] = useState<EditorLanguage>("javascript");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [background, setBackground] = useState<Background>("aurora");
  const [padding, setPadding] = useState(48);
  const [radius, setRadius] = useState(24);
  const [shadow, setShadow] = useState(true);
  const [theme, setTheme] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState(14);
  const [watermark, setWatermark] = useState(true);
  const [hdExport, setHdExport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSupporting, setIsSupporting] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Advanced Feature States
  const [opacity, setOpacity] = useState(0.8);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [showWindowButtons, setShowWindowButtons] = useState(true);
  const [cardTitle, setCardTitle] = useState("contentio.preview");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("auto");
  const [borderWidth, setBorderWidth] = useState(1);

  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formatterRef = useRef<() => Promise<void> | null>(null);

  const trackInteraction = async (eventType: string, metadata?: Record<string, unknown>) => {
    try {
      await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          path: '/editor',
          metadata: {
            mode,
            theme,
            aspectRatio,
            ...(metadata || {}),
          },
        }),
      });
    } catch {
      // Ignore telemetry failures to keep UI responsive.
    }
  };

  // --- Demo snippets per language
  const demoSnippets: Record<string, string> = {
    javascript: `// JavaScript demo\nfunction greet(name) {\n  return ` + "`Hello, ${name}!`" + `\n}\nconsole.log(greet('ContentIo'));`,
    typescript: `// TypeScript demo\nfunction greet(name: string): string {\n  return ` + "`Hello, ${name}!`" + `\n}\nconsole.log(greet('ContentIo'));`,
    python: `# Python demo\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet('ContentIo'))`,
    bash: `# Bash demo\necho "Hello from ContentIo"\n`,
    java: `// Java demo\npublic class Hello {\n  public static void main(String[] args) {\n    System.out.println("Hello, ContentIo");\n  }\n}\n`,
    cpp: `// C++ demo\n#include <iostream>\nint main() {\n  std::cout << "Hello, ContentIo" << std::endl;\n  return 0;\n}\n`,
  };

  const setDemoForLanguageIfAppropriate = (nextLang: string) => {
    const currentTrim = (code || '').trim();
    const isEmpty = currentTrim.length === 0;
    // If code is empty or equals one of the existing demos or starter code, replace with new demo
    const knownDemoMatch = Object.values(demoSnippets).some(s => s.trim() === currentTrim);
    if (isEmpty || knownDemoMatch || currentTrim === starterCode.trim()) {
      const snippet = (demoSnippets as any)[nextLang] ?? '';
      setCode(snippet);
      // after setting code, request formatting if available
      setTimeout(() => formatterRef.current && formatterRef.current(), 50);
    }
  };

  useEffect(() => {
    trackInteraction('editor_viewed', {
      authenticated: Boolean(isSignedIn),
      userId: userId ?? null,
    });
  }, [isSignedIn, userId]);

  useEffect(() => {
    const syncTheme = () => {
      setAppTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const isDarkTheme = appTheme === "dark";
  const surfaceClass = isDarkTheme
    ? "border border-slate-700/70 bg-slate-900/80"
    : "border border-slate-200 bg-white";
  const headingClass = isDarkTheme ? "text-slate-50" : "text-slate-900";
  const mutedClass = isDarkTheme ? "text-slate-300" : "text-slate-600";

  const handleExport = async () => {
    if (!isSignedIn) {
      await trackInteraction('export_blocked_unauth', { reason: 'signin_required' });
      openSignIn({ forceRedirectUrl: '/editor' });
      return;
    }

    await trackInteraction('export_clicked', { hdExport });
    setIsExporting(true);

    try {
      if (!previewRef.current) {
        throw new Error('Preview element not found');
      }

      const scale = hdExport ? 3 : 2;
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: scale,
        width: previewRef.current.offsetWidth,
        height: previewRef.current.offsetHeight,
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `contentio-export-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await trackInteraction('export_success', { hdExport, scale });
    } catch (error) {
      console.error('Export failed:', error);
      await trackInteraction('export_error', { 
        hdExport, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSupport = async () => {
    setIsSupporting(true);
    await trackInteraction('support_clicked');

    try {
      const response = await fetch('/api/support/create-checkout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create support checkout');
      }

      const payload = (await response.json()) as { checkoutUrl?: string };

      if (payload.checkoutUrl) {
        window.location.href = payload.checkoutUrl;
        return;
      }

      throw new Error('Missing checkout URL');
    } catch {
      setIsSupporting(false);
      await trackInteraction('support_failed');
    }
  };

  return (
    <div className={`editor-shell min-h-screen selection:bg-fuchsia-500/20 font-sans overflow-x-hidden ${isDarkTheme ? "text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <Navbar />

      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 overflow-x-hidden">
        <div className={`editor-surface mb-6 flex flex-col gap-4 rounded-[24px] p-4 shadow-sm backdrop-blur-xl sm:mb-8 sm:rounded-[28px] sm:p-6 lg:flex-row lg:items-center lg:justify-between ${surfaceClass}`}>
          <div>
            <h1 className={`editor-heading font-display mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${headingClass}`}>Studio Design Editor</h1>
            <p className={`editor-muted mt-2 text-sm ${mutedClass}`}>Transform your screenshots and snippets into production-ready assets.</p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:gap-2 lg:w-auto lg:justify-end">
            <button className={`hidden sm:flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm transition ${isDarkTheme ? "border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
               <Save className="h-4 w-4" /> <span className="hidden sm:inline">Save Draft</span>
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
            >
              {isExporting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Download PNG"}</span>
              <span className="sm:hidden">{isExporting ? "..." : "Export"}</span>
            </button>
            <button
              onClick={handleSupport}
              disabled={isSupporting}
              className={`support-action flex-1 sm:flex-none inline-flex items-center justify-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition disabled:opacity-60 ${isDarkTheme ? "border border-cyan-300/40 bg-gradient-to-r from-cyan-500/25 to-fuchsia-500/25 text-cyan-100 hover:brightness-110" : "border border-cyan-300/60 bg-cyan-100 text-cyan-800 hover:bg-cyan-200"}`}
            >
              {isSupporting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <HeartHandshake className="h-4 w-4" />}
              <span className="hidden sm:inline">{isSupporting ? "Redirecting..." : "Support Us"}</span>
              <span className="sm:hidden">{isSupporting ? "..." : "Support"}</span>
            </button>
            <div className="ml-auto lg:ml-0">
              {!isSignedIn && (
                <SignInButton mode="modal" forceRedirectUrl="/editor">
                  <button className={`rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition ${isDarkTheme ? "border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
                    Sign In
                  </button>
                </SignInButton>
              )}
              {isSignedIn && <UserButton />}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[340px_1fr] lg:gap-6">
          {/* Mobile sidebar toggle */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden mb-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            {sidebarOpen ? '✕ Close' : '☰ Customize'}
          </button>

          {/* Sidebar - visible on lg+, or toggled on mobile */}
          <aside className={`space-y-6 ${!sidebarOpen && 'hidden'} lg:block lg:space-y-6`}>
            {/* Input Selection */}
            <div className={`editor-surface rounded-[20px] p-3 sm:p-4 shadow-sm ${surfaceClass}`}>
              <div className={`flex gap-1 sm:gap-2 rounded-lg p-1 ${isDarkTheme ? "bg-slate-800" : "bg-slate-100"}`}>
                <button onClick={() => setMode("image")} className={`flex flex-1 items-center justify-center gap-1 sm:gap-2 rounded-md sm:rounded-lg py-2 text-[11px] sm:text-xs font-semibold transition ${mode === "image" ? isDarkTheme ? "bg-slate-700 text-slate-50 shadow-sm" : "bg-white text-slate-950 shadow-sm" : isDarkTheme ? "text-slate-300 hover:bg-slate-700/70" : "text-slate-500 hover:bg-white"}`}>
                  <ImagePlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Screenshot</span><span className="sm:hidden">Shot</span>
                </button>
                <button onClick={() => setMode("code")} className={`flex flex-1 items-center justify-center gap-1 sm:gap-2 rounded-md sm:rounded-lg py-2 text-[11px] sm:text-xs font-semibold transition ${mode === "code" ? isDarkTheme ? "bg-slate-700 text-slate-50 shadow-sm" : "bg-white text-slate-950 shadow-sm" : isDarkTheme ? "text-slate-300 hover:bg-slate-700/70" : "text-slate-500 hover:bg-white"}`}>
                  <FileCode2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Snippet</span><span className="sm:hidden">Code</span>
                </button>
              </div>
              <div className="mt-3 sm:mt-4">
                {mode === "image" ? (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
                    className={`rounded-lg sm:rounded-xl border border-dashed p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition ${isDarkTheme ? "border-slate-700 bg-slate-900/60 hover:border-cyan-400" : "border-slate-200 bg-slate-50 hover:border-cyan-400"}`}
                  >
                    <CloudUpload className="h-6 sm:h-8 w-6 sm:w-8 text-slate-400 mb-1 sm:mb-2" />
                    <span className={`text-[10px] sm:text-xs font-medium ${isDarkTheme ? "text-slate-300" : "text-slate-500"}`}>Click to upload image</span>
                    <input
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files && e.target.files[0];
                        if (f) {
                          const url = URL.createObjectURL(f);
                          setImageUrl(url);
                          trackInteraction('image_uploaded', { size: f.size, type: f.type });
                        }
                        // reset so same file can be chosen again
                        e.currentTarget.value = '';
                      }}
                    />
                  </div>
                ) : (
                  <CodeEditor
                      code={code}
                      onCodeChange={setCode}
                      language={language}
                      onLanguageChange={(next) => { setLanguage(next); setDemoForLanguageIfAppropriate(next); }}
                      onRegisterFormatter={(format) => { formatterRef.current = format; }}
                    />
                )}
              </div>
            </div>

            {/* Customization Panel */}
            <div className={`editor-surface rounded-[24px] p-3 space-y-4 shadow-sm sm:p-4 lg:max-h-[72vh] lg:overflow-y-auto custom-scrollbar ${surfaceClass}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className={`editor-heading text-sm font-bold ${headingClass}`}>Customization</span>
                 <Sparkles className="h-4 w-4 text-fuchsia-400" />
              </div>

              <section>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 block">Background</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(backgroundMap) as Background[]).map(b => (
                    <button key={b} onClick={() => setBackground(b)} className={`rounded-xl border px-2 py-2 text-[10px] capitalize transition ${background === b ? "border-cyan-400 bg-cyan-50 text-slate-900" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                 <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Box Styling</label>
                  <div className="space-y-3">
                    <SliderRow label="Padding" valueLabel={`${padding}px`} value={padding} min={0} max={120} onChange={setPadding} />
                    <SliderRow label="Glass Opacity" valueLabel={`${Math.round(opacity * 100)}%`} value={opacity} min={0} max={1} step={0.05} onChange={setOpacity} />
                    <SliderRow label="Radius" valueLabel={`${radius}px`} value={radius} min={0} max={64} onChange={setRadius} />
                 </div>
              </section>

              <section className="space-y-4">
                 <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">3D Perspective (Beta)</label>
                  <div className="space-y-3">
                    <SliderRow label="Tilt X" valueLabel={`${tiltX}°`} value={tiltX} min={-30} max={30} onChange={setTiltX} tone="cyan" />
                    <SliderRow label="Tilt Y" valueLabel={`${tiltY}°`} value={tiltY} min={-30} max={30} onChange={setTiltY} tone="cyan" />
                 </div>
              </section>

              <section className="space-y-4">
                 <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Aesthetic</label>
                 <div className="space-y-3">
                    <input 
                      className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-fuchsia-400 transition"
                      placeholder="Card Title..."
                      value={cardTitle}
                      onChange={(e) => setCardTitle(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                       <button onClick={() => setTheme("dark")} className={`rounded-xl py-2 text-xs border ${theme === 'dark' ? 'border-fuchsia-400 bg-fuchsia-400/10' : 'border-white/5 bg-slate-950/50 text-slate-400'}`}>Dark Theme</button>
                       <button onClick={() => setTheme("light")} className={`rounded-xl py-2 text-xs border ${theme === 'light' ? 'border-fuchsia-400 bg-fuchsia-400/10' : 'border-white/5 bg-slate-950/50 text-slate-400'}`}>Light Theme</button>
                    </div>
                    <div className="flex gap-2">
                       {(["auto", "1:1", "16:9", "4:5"] as AspectRatio[]).map(a => (
                         <button key={a} onClick={() => setAspectRatio(a)} className={`flex-1 rounded-xl py-2 text-[10px] border ${aspectRatio === a ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/5'}`}>{a}</button>
                       ))}
                    </div>
                    <label className="flex items-center justify-between px-1 text-[11px] text-slate-400">
                      macOS Buttons
                      <input type="checkbox" checked={showWindowButtons} onChange={e => setShowWindowButtons(e.target.checked)} className="accent-fuchsia-500" />
                    </label>
                 </div>
              </section>
            </div>
          </aside>

          <section className="flex flex-col gap-4 lg:gap-6">
            <div className={`editor-surface rounded-[20px] lg:rounded-[24px] p-3 sm:p-4 shadow-sm overflow-hidden min-h-[360px] sm:min-h-[420px] flex items-center justify-center relative lg:min-h-[600px] lg:p-8 ${surfaceClass}`}>
              <div className={`editor-muted absolute top-6 left-6 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold ${isDarkTheme ? "text-slate-300" : "text-slate-500"}`}>
                  <Eye className="h-3 w-3" /> Live Perspective Render
               </div>
               
               <PreviewCard
                 ref={previewRef}
                 mode={mode}
                 imageUrl={imageUrl}
                 code={code}
                 language={language}
                 background={background}
                 padding={padding}
                 radius={radius}
                 shadow={shadow}
                 theme={theme}
                 fontSize={fontSize}
                 watermark={watermark}
                 opacity={opacity}
                 tiltX={tiltX}
                 tiltY={tiltY}
                 showWindowButtons={showWindowButtons}
                 cardTitle={cardTitle}
                 aspectRatio={aspectRatio}
                 borderWidth={borderWidth}
               />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
               <div className={`editor-surface rounded-[20px] lg:rounded-[24px] p-3 flex items-center justify-between text-[10px] sm:text-xs shadow-sm ${surfaceClass} ${isDarkTheme ? "text-slate-300" : "text-slate-500"}`}>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="hidden sm:inline">Live Canvas Active</span><span className="sm:hidden">Active</span>
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px]">{aspectRatio}</span>
               </div>
               <div className={`editor-surface rounded-[20px] lg:rounded-[24px] p-3 flex items-center justify-between text-[10px] sm:text-xs shadow-sm ${surfaceClass} ${isDarkTheme ? "text-slate-300" : "text-slate-500"}`}>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
                    <span className="hidden sm:inline">HD Export Mode</span><span className="sm:hidden">HD</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[9px] sm:text-xs">3x</span>
                    <input type="checkbox" checked={hdExport} onChange={e => setHdExport(e.target.checked)} className="accent-cyan-400 w-3 h-3" />
                  </label>
               </div>
            </div>
          </section>
        </div>
      </main>

      <footer className={`editor-surface border-t py-8 sm:py-12 mt-12 sm:mt-20 ${surfaceClass}`}>
        <div className="mx-auto max-w-7xl px-3 sm:px-4 text-center">
          <p className={`text-[9px] sm:text-[10px] uppercase tracking-[0.2em] ${isDarkTheme ? "text-slate-300" : "text-slate-500"}`}>© 2025 contentIo Studio • Made for Creators</p>
        </div>
      </footer>
      <style jsx>{`
        :global(.preview-code pre),
        :global(.preview-code code),
        :global(.preview-code span) {
          background: transparent !important;
          background-color: transparent !important;
        }
        :global(.studio-slider) {
          width: 100%;
          height: 8px;
          border-radius: 999px;
          appearance: none;
          -webkit-appearance: none;
          outline: none;
          transition: filter 160ms ease;
        }
        :global(.studio-slider:hover) {
          filter: brightness(1.1);
        }
        :global(.studio-slider::-webkit-slider-runnable-track) {
          height: 8px;
          border-radius: 999px;
          background: transparent;
        }
        :global(.studio-slider::-webkit-slider-thumb) {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%);
          border: 2px solid rgba(15, 23, 42, 0.72);
          box-shadow: 0 4px 14px rgba(6, 182, 212, 0.35);
          cursor: pointer;
        }
        :global(.studio-slider::-moz-range-thumb) {
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%);
          border: 2px solid rgba(15, 23, 42, 0.72);
          box-shadow: 0 4px 14px rgba(6, 182, 212, 0.35);
          cursor: pointer;
        }
        :global(.studio-slider::-moz-range-track) {
          height: 8px;
          border-radius: 999px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default EditorStudio;