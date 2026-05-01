"use client";

import React, { useState, useRef, useEffect, forwardRef } from 'react';
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
  Zap,
  Shield,
  Eye,
  ArrowLeft,
  Moon,
  SunMedium,
  Settings2,
  Monitor,
  Menu,
  X,
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { LoadingLink } from './LoadingLink';
import favicon from '@/app/assets/Favicon.png';

// ─── Types ────────────────────────────────────────────────────────────────────

const backgroundMap = {
  aurora:   "linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #22d3ee 100%)",
  sunset:   "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
  midnight: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
  emerald:  "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
  graphite: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  glass:    "rgba(255, 255, 255, 0.05)",
};

export type Background  = keyof typeof backgroundMap;
export type Theme       = "dark" | "light" | "neon" | "ocean" | "sunset";
export type AspectRatio = "auto" | "1:1" | "16:9" | "4:5";
export type Mode        = "image" | "code";
type EditorLanguage     = "javascript" | "typescript" | "python" | "bash" | "java" | "cpp";
// Mobile panel tab
type MobileTab = "input" | "style" | "preview";

const themeStyles = {
  dark:   vscDarkPlus,
  light:  oneLight,
  neon:   synthwave84,
  ocean:  materialOceanic,
  sunset: coldarkDark,
} as const;

const starterCode = `const product = "ContentIo";

function launch() {
  return {
    headline: "Ship polished content fast",
    vibe: "glass + gradients + social-ready exports",
  };
}

console.log(launch());`;

// ─── SliderRow ────────────────────────────────────────────────────────────────

interface SliderRowProps {
  label: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
  tone?: "fuchsia" | "cyan";
}

const SliderRow = ({ label, valueLabel, value, min, max, step, onChange, tone = "fuchsia" }: SliderRowProps) => {
  const progress    = ((value - min) / (max - min)) * 100;
  const activeColor = tone === "cyan" ? "#22d3ee" : "#d946ef";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
      <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        <span>{label}</span>
        <span className="font-mono text-slate-300">{valueLabel}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="studio-slider"
        style={{ background: `linear-gradient(90deg, ${activeColor} ${progress}%, rgba(148,163,184,0.22) ${progress}%)` }}
      />
    </div>
  );
};

// ─── PreviewCard ──────────────────────────────────────────────────────────────

interface PreviewCardProps {
  mode: Mode; imageUrl: string | null; code: string; background: Background;
  padding: number; radius: number; shadow: boolean; theme: Theme; fontSize: number;
  language: EditorLanguage; watermark: boolean; opacity: number; tiltX: number;
  tiltY: number; showWindowButtons: boolean; cardTitle: string;
  aspectRatio: AspectRatio; borderWidth: number;
}

const PreviewCard = forwardRef<HTMLDivElement, PreviewCardProps>(
  ({ mode, imageUrl, code, background, padding, radius, shadow, theme,
     fontSize, language, watermark, opacity, tiltX, tiltY,
     showWindowButtons, cardTitle, aspectRatio, borderWidth }, ref) => {

    const borderRadius = `${radius}px`;
    const innerRadius  = `${Math.max(radius - 12, 8)}px`;
    const surfaceBg    = theme === "light"
      ? `rgba(255,255,255,${opacity})`
      : `rgba(2,6,23,${opacity})`;
    const textCol = theme === "light" ? "text-slate-800" : "text-white";

    return (
      /* Outer scroll container — swipeable on mobile */
      <div className="preview-scroll-wrapper w-full overflow-x-auto overflow-y-hidden">
        <div
          ref={ref}
          className="preview-capture inline-block min-w-full"
          style={{
            padding: `${padding}px`,
            background: backgroundMap[background],
          }}
        >
          <div
            className="relative border border-white/10 backdrop-blur-xl"
            style={{
              borderRadius,
              boxShadow: shadow ? "0 40px 100px rgba(0,0,0,0.5)" : "none",
              background: surfaceBg,
              borderWidth: `${borderWidth}px`,
              transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
              ...(aspectRatio === "1:1"  ? { aspectRatio: "1/1"  } : {}),
              ...(aspectRatio === "16:9" ? { aspectRatio: "16/9" } : {}),
              ...(aspectRatio === "4:5"  ? { aspectRatio: "4/5"  } : {}),
            }}
          >
            {/* Title bar */}
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

            {/* Content — never clips, scrolls horizontally if needed */}
            <div className="preview-code">
              {mode === "image" && imageUrl ? (
                <div className="p-4">
                  <img
                    src={imageUrl} alt="Preview"
                    className="h-auto w-full object-contain"
                    style={{ borderRadius: innerRadius }}
                  />
                </div>
              ) : (
                <SyntaxHighlighter
                  language={language}
                  style={themeStyles[theme]}
                  showLineNumbers
                  wrapLongLines={false}
                  customStyle={{
                    margin: 0,
                    padding: "1.5rem",
                    fontSize: `${fontSize}px`,
                    background: "transparent",
                    lineHeight: 1.7,
                    overflowX: "auto",
                    whiteSpace: "pre",
                  }}
                  lineNumberStyle={{ opacity: 0.25, minWidth: "2.5em", paddingRight: "1em", userSelect: "none" }}
                  codeTagProps={{ style: { backgroundColor: "transparent" } }}
                  lineProps={() => ({ style: { display: "block", backgroundColor: "transparent" } })}
                >
                  {code}
                </SyntaxHighlighter>
              )}
            </div>

            {/* Watermark */}
            {watermark && (
              <div className="absolute bottom-3 right-4 flex items-center gap-1.5 opacity-30">
                <Sparkles className="h-2.5 w-2.5 text-white" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">ContentIo</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
PreviewCard.displayName = "PreviewCard";

// ─── Navbar ───────────────────────────────────────────────────────────────────

const EditorNavbar = ({ isDarkTheme, onThemeToggle, isExporting, isSupporting, onExport, onSupport }: {
  isDarkTheme: boolean;
  onThemeToggle: () => void;
  isExporting: boolean;
  isSupporting: boolean;
  onExport: () => void;
  onSupport: () => void;
}) => {
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl">
      {/* Announcement bar */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 py-1.5 text-center text-[10px] font-medium text-slate-600 dark:text-slate-400">
        <span className="mr-2 inline-flex items-center gap-1 rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-500/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-400">
          New
        </span>
        AI-powered style suggestions just launched →{" "}
        <span className="cursor-pointer underline underline-offset-2 hover:text-slate-900 dark:hover:text-white">
          Try it free
        </span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Left: back + logo */}
        <div className="flex items-center gap-2.5">
          <LoadingLink href="/" loadingLabel="Back..." className="inline-flex items-center gap-1.5 hover:opacity-80 transition">
            <ArrowLeft className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline text-sm font-medium text-slate-500 dark:text-slate-400">Back</span>
          </LoadingLink>
          <span className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400">
            <img src={favicon.src} alt="logo" className="h-4 w-4 object-contain" />
          </span>
          <span className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-white">
            content<span className="text-fuchsia-400">Io</span>
          </span>
        </div>

        {/* Center nav — desktop only */}
        <nav className="hidden items-center gap-1 lg:flex">
          {["Features", "Demo", "Support"].map((l) => (
            <span key={l} className="cursor-pointer rounded-lg px-3 py-2 text-[12px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              {l}
            </span>
          ))}
        </nav>

        {/* Right: actions — desktop */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={onThemeToggle}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {isDarkTheme ? <SunMedium className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {isDarkTheme ? "Light" : "Dark"}
          </button>
          <button
            onClick={onSupport} disabled={isSupporting}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/60 bg-cyan-100 dark:border-cyan-300/40 dark:bg-gradient-to-r dark:from-cyan-500/25 dark:to-fuchsia-500/25 px-3 py-2 text-[12px] font-semibold text-cyan-800 dark:text-cyan-100 transition hover:opacity-90 disabled:opacity-50"
          >
            {isSupporting ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <HeartHandshake className="h-3.5 w-3.5" />}
            Support Us
          </button>
          <button
            onClick={onExport} disabled={isExporting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-4 py-2 text-[12px] font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
          >
            {isExporting ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            {isExporting ? "Exporting..." : "Export PNG"}
          </button>
          {isSignedIn ? <UserButton /> : (
            <SignInButton mode="modal" forceRedirectUrl="/editor">
              <button className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>

        {/* Mobile: export + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onExport} disabled={isExporting}
            className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
          >
            {isExporting ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            Export
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            <button onClick={onThemeToggle} className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200">
              {isDarkTheme ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Switch to {isDarkTheme ? "Light" : "Dark"} Mode
            </button>
            <button onClick={() => { onSupport(); setMobileMenuOpen(false); }} disabled={isSupporting} className="flex items-center gap-2 rounded-xl border border-cyan-300/60 bg-cyan-50 dark:bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-800 dark:text-cyan-200 disabled:opacity-50">
              {isSupporting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <HeartHandshake className="h-4 w-4" />}
              Support Us
            </button>
            {!isSignedIn ? (
              <SignInButton mode="modal" forceRedirectUrl="/editor">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-100">
                  Sign In
                </button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-2 px-1">
                <UserButton /> <span className="text-sm text-slate-600 dark:text-slate-300">Account</span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// ─── Main EditorStudio ────────────────────────────────────────────────────────

export function EditorStudio() {
  const { isSignedIn, userId } = useAuth();
  const { openSignIn }         = useClerk();

  // App theme
  const [appTheme, setAppTheme] = useState<"light" | "dark">("light");

  // Editor state
  const [mode, setMode]         = useState<Mode>("image");
  const [code, setCode]         = useState(starterCode);
  const [language, setLanguage] = useState<EditorLanguage>("javascript");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Style state
  const [background, setBackground]     = useState<Background>("aurora");
  const [padding, setPadding]           = useState(48);
  const [radius, setRadius]             = useState(24);
  const [shadow, setShadow]             = useState(true);
  const [theme, setTheme]               = useState<Theme>("light");
  const [fontSize, setFontSize]         = useState(14);
  const [watermark, setWatermark]       = useState(true);
  const [hdExport, setHdExport]         = useState(false);
  const [opacity, setOpacity]           = useState(0.8);
  const [tiltX, setTiltX]               = useState(0);
  const [tiltY, setTiltY]               = useState(0);
  const [showWindowButtons, setShowWindowButtons] = useState(true);
  const [cardTitle, setCardTitle]       = useState("contentio.preview");
  const [aspectRatio, setAspectRatio]   = useState<AspectRatio>("auto");
  const [borderWidth, setBorderWidth]   = useState(1);

  // UI state
  const [isExporting, setIsExporting]   = useState(false);
  const [isSupporting, setIsSupporting] = useState(false);
  // Mobile tab: "input" | "style" | "preview"
  const [mobileTab, setMobileTab]       = useState<MobileTab>("input");

  const previewRef  = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formatterRef = useRef<() => Promise<void>>(async () => {});

  // Sync app theme from <html data-theme>
  useEffect(() => {
    const sync = () =>
      setAppTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const isDarkTheme = appTheme === "dark";
  const surfaceClass = isDarkTheme
    ? "border border-slate-700/70 bg-slate-900/80"
    : "border border-slate-200 bg-white";
  const headingClass = isDarkTheme ? "text-slate-50"  : "text-slate-900";
  const mutedClass   = isDarkTheme ? "text-slate-300" : "text-slate-600";

  const handleThemeToggle = () => {
    const next = isDarkTheme ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("contentio-theme", next);
  };

  const trackInteraction = async (eventType: string, metadata?: Record<string, unknown>) => {
    try {
      await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, path: '/editor', metadata: { mode, theme, aspectRatio, ...metadata } }),
      });
    } catch { /* ignore */ }
  };

  const handleExport = async () => {
    if (!isSignedIn) { openSignIn({ forceRedirectUrl: '/editor' }); return; }
    setIsExporting(true);
    try {
      if (!previewRef.current) return;
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true, pixelRatio: hdExport ? 3 : 2,
        width: previewRef.current.offsetWidth,
        height: previewRef.current.offsetHeight,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `contentio-${Date.now()}.png`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } finally { setIsExporting(false); }
  };

  const handleSupport = async () => {
    setIsSupporting(true);
    try {
      const res = await fetch('/api/support/create-checkout', { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      const payload = await res.json() as { checkoutUrl?: string };
      if (payload.checkoutUrl) { window.location.href = payload.checkoutUrl; return; }
    } catch { /* ignore */ }
    setIsSupporting(false);
  };

  // Demo snippets
  const demoSnippets: Record<string, string> = {
    javascript: `async function fetchUser(id) {
  const res = await fetch(\`https://api.example.com/users/\${id}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  const user = await res.json();
  console.log(\`Name: \${user.name}\`);
  return user;
}
fetchUser(42);`,
    typescript: `interface User { id: number; name: string; email: string; }

async function fetchUser(id: number): Promise<User | null> {
  try {
    const res = await fetch(\`https://api.example.com/users/\${id}\`);
    return (await res.json()) as User;
  } catch { return null; }
}`,
    python: `import urllib.request, json

def fetch_user(user_id: int) -> dict:
    url = f"https://api.example.com/users/{user_id}"
    with urllib.request.urlopen(url) as r:
        return json.loads(r.read().decode())

user = fetch_user(42)
print(f"Name: {user['name']}")`,
    bash: `#!/bin/bash
set -e
APP="contentio"
echo "🚀 Deploying $APP..."
npm ci && npm run lint && npm run build
vercel --prod --yes
echo "✅ Done!"`,
    java: `public class ApiClient {
  public static String fetchUser(int id) throws Exception {
    var client = HttpClient.newHttpClient();
    var req = HttpRequest.newBuilder()
      .uri(URI.create("https://api.example.com/users/" + id))
      .GET().build();
    var res = client.send(req, BodyHandlers.ofString());
    return res.body();
  }
}`,
    cpp: `#include <iostream>
#include <vector>

std::vector<int> twoSum(std::vector<int>& nums, int target) {
  for (size_t i = 0; i < nums.size(); i++)
    for (size_t j = i+1; j < nums.size(); j++)
      if (nums[i]+nums[j] == target) return {(int)i,(int)j};
  return {};
}`,
  };

  const setDemoForLanguage = (nextLang: string) => {
    const trim = (code || '').trim();
    const isDemo = Object.values(demoSnippets).some(s => s.trim() === trim);
    if (!trim || isDemo || trim === starterCode.trim()) {
      setCode((demoSnippets as Record<string, string>)[nextLang] ?? '');
      setTimeout(() => formatterRef.current?.(), 50);
    }
  };

  // ─── Mobile tab bar config ─────────────────────────────────────────────────
  const mobileTabs: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
    { id: "input",   label: "Input",   icon: <ImagePlus  className="h-4 w-4" /> },
    { id: "style",   label: "Style",   icon: <Settings2  className="h-4 w-4" /> },
    { id: "preview", label: "Preview", icon: <Monitor    className="h-4 w-4" /> },
  ];

  // ─── Shared Customize Panel ────────────────────────────────────────────────

  const CustomizePanel = () => (
    <div className={`rounded-[20px] lg:rounded-[24px] p-4 shadow-sm space-y-5 lg:max-h-[72vh] lg:overflow-y-auto custom-scrollbar ${surfaceClass}`}>
      <div className={`flex items-center justify-between border-b pb-3 ${isDarkTheme ? "border-slate-700" : "border-slate-200"}`}>
        <span className={`text-sm font-bold ${headingClass}`}>Customization</span>
        <Sparkles className="h-4 w-4 text-fuchsia-400" />
      </div>

      {/* Background */}
      <section className="space-y-2">
        <label className={`block text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>Background</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(backgroundMap) as Background[]).map(b => (
            <button key={b} onClick={() => setBackground(b)}
              className={`rounded-xl border px-2 py-2 text-[10px] capitalize truncate transition ${
                background === b
                  ? isDarkTheme ? "border-cyan-400 bg-cyan-400/10 text-white" : "border-cyan-400 bg-cyan-50 text-slate-900"
                  : isDarkTheme ? "border-white/10 bg-slate-950/50 text-slate-300 hover:bg-white/5" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >{b}</button>
          ))}
        </div>
      </section>

      {/* Box Styling */}
      <section className="space-y-3">
        <label className={`block text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>Box Styling</label>
        <SliderRow label="Padding"       valueLabel={`${padding}px`}             value={padding}  min={0}   max={120}  onChange={setPadding} />
        <SliderRow label="Glass Opacity" valueLabel={`${Math.round(opacity*100)}%`} value={opacity} min={0}   max={1}    step={0.05} onChange={setOpacity} />
        <SliderRow label="Radius"        valueLabel={`${radius}px`}               value={radius}   min={0}   max={64}   onChange={setRadius} />
      </section>

      {/* 3D */}
      <section className="space-y-3">
        <label className={`block text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>3D Perspective (Beta)</label>
        <SliderRow label="Tilt X" valueLabel={`${tiltX}°`} value={tiltX} min={-30} max={30} onChange={setTiltX} tone="cyan" />
        <SliderRow label="Tilt Y" valueLabel={`${tiltY}°`} value={tiltY} min={-30} max={30} onChange={setTiltY} tone="cyan" />
      </section>

      {/* Aesthetic */}
      <section className="space-y-3">
        <label className={`block text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>Aesthetic</label>
        <input
          className={`w-full rounded-xl border px-3 py-2 text-xs outline-none transition focus:border-fuchsia-400 ${
            isDarkTheme ? "border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
          }`}
          placeholder="Window title..." value={cardTitle}
          onChange={e => setCardTitle(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          {(["dark", "light", "neon", "ocean", "sunset"] as Theme[]).map(t => (
            <button key={t} onClick={() => setTheme(t)}
              className={`rounded-xl border py-2 text-xs capitalize transition ${
                theme === t
                  ? isDarkTheme ? "border-fuchsia-400 bg-fuchsia-400/10 text-white" : "border-fuchsia-400 bg-fuchsia-50 text-fuchsia-700"
                  : isDarkTheme ? "border-white/10 bg-slate-950/50 text-slate-400 hover:bg-white/5" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >{t}</button>
          ))}
        </div>
        {/* Aspect ratio */}
        <div className="grid grid-cols-4 gap-2">
          {(["auto", "1:1", "16:9", "4:5"] as AspectRatio[]).map(a => (
            <button key={a} onClick={() => setAspectRatio(a)}
              className={`rounded-xl border py-2 text-[10px] transition ${
                aspectRatio === a
                  ? isDarkTheme ? "border-cyan-400 bg-cyan-400/10 text-white" : "border-cyan-400 bg-cyan-50 text-slate-900"
                  : isDarkTheme ? "border-white/10 bg-slate-950/50 text-slate-400 hover:bg-white/5" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >{a}</button>
          ))}
        </div>
        {/* Toggles */}
        {[
          { label: "macOS Buttons", checked: showWindowButtons, set: setShowWindowButtons },
          { label: "Watermark",     checked: watermark,         set: setWatermark         },
        ].map(({ label, checked, set }) => (
          <label key={label} className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-xs ${
            isDarkTheme ? "border-white/10 bg-slate-950/50 text-slate-300" : "border-slate-200 bg-white text-slate-700"
          }`}>
            {label}
            <input type="checkbox" checked={checked} onChange={e => set(e.target.checked)} className="accent-fuchsia-500 h-3.5 w-3.5 ml-2" />
          </label>
        ))}
        <label className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-xs ${
          isDarkTheme ? "border-white/10 bg-slate-950/50 text-slate-300" : "border-slate-200 bg-white text-slate-700"
        }`}>
          <span className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-cyan-400" /> HD Export (3×PNG)</span>
          <input type="checkbox" checked={hdExport} onChange={e => setHdExport(e.target.checked)} className="accent-cyan-400 h-3.5 w-3.5 ml-2" />
        </label>
      </section>
    </div>
  );

  // ─── Input panel content ───────────────────────────────────────────────────

  const InputPanel = () => (
    <div className={`rounded-[20px] lg:rounded-[24px] p-3 sm:p-4 shadow-sm ${surfaceClass}`}>
      {/* Mode tabs */}
      <div className={`flex gap-1.5 rounded-xl p-1 ${isDarkTheme ? "bg-slate-800" : "bg-slate-100"}`}>
        <button onClick={() => setMode("image")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition ${
            mode === "image"
              ? isDarkTheme ? "bg-slate-700 text-slate-50 shadow-sm" : "bg-white text-slate-950 shadow-sm"
              : isDarkTheme ? "text-slate-300 hover:bg-slate-700/70" : "text-slate-500 hover:bg-white"
          }`}>
          <ImagePlus className="h-4 w-4" /> Screenshot
        </button>
        <button onClick={() => setMode("code")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition ${
            mode === "code"
              ? isDarkTheme ? "bg-slate-700 text-slate-50 shadow-sm" : "bg-white text-slate-950 shadow-sm"
              : isDarkTheme ? "text-slate-300 hover:bg-slate-700/70" : "text-slate-500 hover:bg-white"
          }`}>
          <FileCode2 className="h-4 w-4" /> Snippet
        </button>
      </div>

      <div className="mt-3">
        {mode === "image" ? (
          <div
            role="button" tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center transition ${
              isDarkTheme ? "border-slate-700 bg-slate-900/60 hover:border-cyan-400" : "border-slate-200 bg-slate-50 hover:border-cyan-400"
            }`}
          >
            <CloudUpload className="mb-2 h-8 w-8 text-slate-400" />
            <span className={`text-xs font-medium ${mutedClass}`}>Click to upload image</span>
            <span className={`mt-1 text-[10px] ${mutedClass} opacity-70`}>PNG, JPG, WebP supported</span>
            <input
              ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === "string") setImageUrl(reader.result);
                };
                reader.readAsDataURL(f);
                e.currentTarget.value = '';
              }}
            />
          </div>
        ) : (
          <CodeEditor
            code={code} onCodeChange={setCode}
            language={language}
            onLanguageChange={next => { setLanguage(next as EditorLanguage); setDemoForLanguage(next); }}
            onRegisterFormatter={fn => { formatterRef.current = fn; }}
          />
        )}
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={`editor-shell min-h-screen overflow-x-hidden font-sans selection:bg-fuchsia-500/20 ${
      isDarkTheme ? "text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      <EditorNavbar
        isDarkTheme={isDarkTheme}
        onThemeToggle={handleThemeToggle}
        isExporting={isExporting}
        isSupporting={isSupporting}
        onExport={handleExport}
        onSupport={handleSupport}
      />

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:py-8">

        {/* Page header — desktop */}
        <div className={`mb-5 hidden lg:flex items-center justify-between rounded-[24px] p-5 shadow-sm backdrop-blur-xl ${surfaceClass}`}>
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${headingClass}`}>Studio Design Editor</h1>
            <p className={`mt-1 text-sm ${mutedClass}`}>Transform your screenshots and snippets into production-ready assets.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition ${
              isDarkTheme ? "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}>
              <Save className="h-4 w-4" /> Save Draft
            </button>
          </div>
        </div>

        {/* ── Mobile tab bar ─────────────────────────────────────────────── */}
        <div className={`mb-4 flex rounded-2xl p-1 lg:hidden ${isDarkTheme ? "bg-slate-800" : "bg-slate-200"}`}>
          {mobileTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition ${
                mobileTab === tab.id
                  ? isDarkTheme ? "bg-slate-700 text-white shadow" : "bg-white text-slate-900 shadow"
                  : isDarkTheme ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Mobile panels ─────────────────────────────────────────────── */}
        <div className="lg:hidden space-y-4">
          {mobileTab === "input"   && <InputPanel />}
          {mobileTab === "style"   && <CustomizePanel />}
          {mobileTab === "preview" && (
            <div className={`rounded-[20px] shadow-sm overflow-hidden ${surfaceClass}`}>
              {/* Header bar */}
              <div className={`flex items-center justify-between px-4 py-3 border-b ${isDarkTheme ? "border-slate-700" : "border-slate-200"}`}>
                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>
                  <Eye className="h-3 w-3" /> Live Preview
                </div>
                {/* Swipe hint */}
                <span className={`flex items-center gap-1 text-[9px] font-medium ${mutedClass} opacity-60`}>
                  <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  swipe to scroll
                </span>
              </div>

              {/* Scrollable preview — full width, no clip */}
              <div
                className="w-full overflow-x-auto overflow-y-hidden"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div style={{ minWidth: "min-content" }}>
                  <PreviewCard
                    ref={previewRef}
                    mode={mode} imageUrl={imageUrl} code={code} language={language}
                    background={background} padding={padding} radius={radius} shadow={shadow}
                    theme={theme} fontSize={fontSize} watermark={watermark} opacity={opacity}
                    tiltX={tiltX} tiltY={tiltY} showWindowButtons={showWindowButtons}
                    cardTitle={cardTitle} aspectRatio={aspectRatio} borderWidth={borderWidth}
                  />
                </div>
              </div>

              {/* Scroll track indicator */}
              <div className={`px-4 py-2 border-t ${isDarkTheme ? "border-slate-700" : "border-slate-200"}`}>
                <div className={`h-0.5 w-full rounded-full ${isDarkTheme ? "bg-slate-700" : "bg-slate-200"}`}>
                  <div className="h-0.5 w-1/3 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" />
                </div>
              </div>

              {/* Status bar */}
              <div className="grid grid-cols-2 gap-0 border-t divide-x" style={{ borderColor: isDarkTheme ? "rgba(71,85,105,0.5)" : "rgba(226,232,240,1)" }}>
                <div className={`flex items-center gap-2 px-4 py-3 text-[10px] ${mutedClass}`}>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live · <span className="font-mono">{aspectRatio}</span>
                </div>
                <label className={`flex cursor-pointer items-center justify-between px-4 py-3 text-[10px] ${mutedClass}`}>
                  <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-cyan-400" /> HD 3×</span>
                  <input type="checkbox" checked={hdExport} onChange={e => setHdExport(e.target.checked)} className="accent-cyan-400 h-3 w-3" />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* ── Desktop two-column layout ──────────────────────────────────── */}
        <div className="hidden lg:grid lg:grid-cols-[340px_1fr] lg:gap-6">

          {/* Left sidebar */}
          <aside className="space-y-5">
            <InputPanel />
            <CustomizePanel />
          </aside>

          {/* Right: preview */}
          <section className="flex flex-col gap-5">
            <div className={`rounded-[24px] shadow-sm flex flex-col min-h-[580px] xl:min-h-[660px] overflow-hidden ${surfaceClass}`}>
              {/* Desktop preview header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${isDarkTheme ? "border-slate-700" : "border-slate-200"}`}>
                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>
                  <Eye className="h-3 w-3" /> Live Perspective Render
                </div>
                <span className={`flex items-center gap-1.5 text-[10px] font-medium ${mutedClass} opacity-50`}>
                  <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  scroll to see full preview
                </span>
              </div>

              {/* Scrollable preview area */}
              <div
                className="flex-1 overflow-auto preview-scroll-area"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="flex min-h-full items-start justify-center p-4" style={{ minWidth: "min-content" }}>
                  <PreviewCard
                    ref={previewRef}
                    mode={mode} imageUrl={imageUrl} code={code} language={language}
                    background={background} padding={padding} radius={radius} shadow={shadow}
                    theme={theme} fontSize={fontSize} watermark={watermark} opacity={opacity}
                    tiltX={tiltX} tiltY={tiltY} showWindowButtons={showWindowButtons}
                    cardTitle={cardTitle} aspectRatio={aspectRatio} borderWidth={borderWidth}
                  />
                </div>
              </div>

              {/* Thin scroll-track bar at bottom */}
              <div className={`px-6 py-2 border-t shrink-0 ${isDarkTheme ? "border-slate-700" : "border-slate-200"}`}>
                <div className={`h-0.5 w-full rounded-full ${isDarkTheme ? "bg-slate-700" : "bg-slate-200"}`}>
                  <div className="h-0.5 w-1/4 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" />
                </div>
              </div>
            </div>

            {/* Status bar */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`flex items-center gap-2 rounded-[20px] border px-4 py-3 text-xs ${surfaceClass} ${mutedClass}`}>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Canvas Active &nbsp;·&nbsp; <span className="font-mono text-[10px]">{aspectRatio}</span>
              </div>
              <label className={`flex cursor-pointer items-center justify-between rounded-[20px] border px-4 py-3 text-xs ${surfaceClass} ${mutedClass}`}>
                <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-cyan-400" /> HD Export Mode</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px]">3×</span>
                  <input type="checkbox" checked={hdExport} onChange={e => setHdExport(e.target.checked)} className="accent-cyan-400 h-3.5 w-3.5" />
                </div>
              </label>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-12 border-t py-8 ${isDarkTheme ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className={`text-[10px] uppercase tracking-[0.2em] ${mutedClass}`}>
            © 2025 contentIo Studio · Made for Creators
          </p>
        </div>
      </footer>

      <style jsx global>{`
        .preview-code pre,
        .preview-code code,
        .preview-code span {
          background: transparent !important;
          background-color: transparent !important;
        }
        .studio-slider {
          width: 100%; height: 8px; border-radius: 999px;
          appearance: none; -webkit-appearance: none; outline: none;
        }
        .studio-slider::-webkit-slider-runnable-track {
          height: 8px; border-radius: 999px; background: transparent;
        }
        .studio-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 16px; height: 16px; border-radius: 999px;
          background: linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%);
          border: 2px solid rgba(15,23,42,0.72);
          box-shadow: 0 4px 14px rgba(6,182,212,0.35);
          cursor: pointer; margin-top: -4px;
        }
        .studio-slider::-moz-range-track {
          height: 8px; border-radius: 999px; background: transparent;
        }
        .studio-slider::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 999px;
          background: linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%);
          border: 2px solid rgba(15,23,42,0.72);
          box-shadow: 0 4px 14px rgba(6,182,212,0.35); cursor: pointer;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        /* Horizontal scroll for preview — smooth on all platforms */
        .preview-scroll-wrapper,
        .preview-scroll-area {
          scrollbar-width: thin;
          scrollbar-color: rgba(168,85,247,0.35) transparent;
          scroll-behavior: smooth;
        }
        .preview-scroll-wrapper::-webkit-scrollbar,
        .preview-scroll-area::-webkit-scrollbar { height: 5px; width: 5px; }
        .preview-scroll-wrapper::-webkit-scrollbar-track,
        .preview-scroll-area::-webkit-scrollbar-track { background: transparent; }
        .preview-scroll-wrapper::-webkit-scrollbar-thumb,
        .preview-scroll-area::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #a855f7, #22d3ee);
          border-radius: 999px;
        }
        /* Ensure code inside preview never force-wraps */
        .preview-code pre { white-space: pre !important; }
        .preview-code code { white-space: pre !important; }
      `}</style>
    </div>
  );
}

export default EditorStudio;