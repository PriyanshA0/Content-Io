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
import { CodeStyleConfig, EditorLanguage, EditorMode, BackgroundPreset } from '@/app/types/styling';
import { DEFAULT_CODE_STYLE_CONFIG, BACKGROUNDS } from '@/lib/stylePresets';
import { WindowFrameRenderer } from './WindowFrameRenderer';
import { CodeHighlighter } from './CodeHighlighter';
import { StyleControls } from './StyleControls';
import type { ImageFilters, ImageAdjustments, ImageOverlay, ImageFrame, ImagePresetId } from '../types/imageEditing';
import { DEFAULT_IMAGE_FILTERS, DEFAULT_IMAGE_ADJUSTMENTS, DEFAULT_IMAGE_OVERLAY, IMAGE_FILTER_PRESETS } from '../types/imageEditing';

// ─── Types ────────────────────────────────────────────────────────────────────
// Mobile panel tab
type MobileTab = "input" | "style" | "preview";

const starterCode = `const product = "ContentIo";

function launch() {
  return {
    headline: "Ship polished content fast",
    vibe: "glass + gradients + social-ready exports",
  };
}

console.log(launch());`;

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
  mode: EditorMode;
  imageUrl: string | null;
  code: string;
  language: EditorLanguage;
  codeStyleConfig: CodeStyleConfig;
  screenshotBorder?: boolean;
  screenshotShadow?: boolean;
  screenshotRadius?: number;
  screenshotPadding?: number;
  screenshotBgStyle?: "gradient" | "solid" | "blur" | "none";
  screenshotBgColor?: string;
  screenshotShadowStrength?: "light" | "medium" | "heavy";
  screenshotBorderColor?: string;
  screenshotBorderWidth?: number;
  screenshotFilter?: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue?: number;
    blur?: number;
  };
  // New image editing props
  imageFilters?: Partial<import('../types/imageEditing').ImageFilters>;
  imageAdjustments?: Partial<import('../types/imageEditing').ImageAdjustments>;
  imageOverlay?: Partial<import('../types/imageEditing').ImageOverlay>;
  imageFrame?: import('../types/imageEditing').ImageFrame;
  glowColor?: string;
  polaroidCaption?: string;
  screenshotOpacity?: number;
  screenshotVignette?: number;
  screenshotTintColor?: string;
  screenshotTintOpacity?: number;
  textOverlay?: { enabled: boolean; text: string; fontSize: number; color: string; position: string };
  cropSettings?: { enabled: boolean; left: number; top: number; width: number; height: number };
  effectsAdvanced?: { glow: number; shadow: number; sepia: number; grayscale: number; invert: number };
}

const PreviewCard = forwardRef<HTMLDivElement, PreviewCardProps>(
  ({ 
    mode, imageUrl, code, language, codeStyleConfig, 
    screenshotBorder = true, 
    screenshotShadow = true, 
    screenshotRadius = 12,
    screenshotPadding = 20,
    screenshotBgStyle = "gradient",
    screenshotBgColor = "#1a1f2e",
    screenshotShadowStrength = "medium",
    screenshotBorderColor = "rgba(255,255,255,0.1)",
    screenshotBorderWidth = 2,
    screenshotFilter = { brightness: 1, contrast: 1, saturation: 1, hue: 0, blur: 0 },
    screenshotOpacity = 1,
    screenshotVignette = 0,
    screenshotTintColor = "#ffffff",
    screenshotTintOpacity = 0,
    textOverlay = { enabled: false, text: "", fontSize: 24, color: "#ffffff", position: "bottom-center" },
    cropSettings = { enabled: false, left: 0, top: 0, width: 100, height: 100 },
    effectsAdvanced = { glow: 0, shadow: 0, sepia: 0, grayscale: 0, invert: 0 },
    imageFilters = undefined,
    imageAdjustments = undefined,
    imageOverlay = undefined,
    imageFrame = "none",
    glowColor = "#a855f7",
    polaroidCaption = ""
  }, ref) => {
    const bg = BACKGROUNDS[codeStyleConfig.background];
    const borderRadius = `${codeStyleConfig.decoration.cornerRadius}px`;
    const innerRadius = `${Math.max(codeStyleConfig.decoration.cornerRadius - 12, 8)}px`;

    const shadowMap = {
      light: "0 4px 12px rgba(0,0,0,0.2)",
      medium: "0 20px 60px rgba(0,0,0,0.6)",
      heavy: "0 40px 100px rgba(0,0,0,0.8)"
    };

    // Grain SVG data URI helper
    const makeGrainUrl = (intensity = 10, seed = 42) => {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><filter id='g'><feTurbulence baseFrequency='0.9' numOctaves='1' seed='${seed}'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 ${Math.min(1, intensity/100)}'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(#g)' opacity='0.6'/></svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    };

    const bgStyleMap = {
      gradient: "linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%)",
      solid: screenshotBgColor,
      blur: `linear-gradient(135deg, rgba(26,31,46,0.95), rgba(15,20,25,0.95))`,
      none: "transparent"
    };

    // Apply vignette effect CSS
    const vignetteStyle = screenshotVignette > 0 
      ? `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,${screenshotVignette * 0.5}) 100%)`
      : "none";

    // Build complete filter string with advanced effects or imageFilters when provided
    const buildFilter = () => {
      if (imageFilters) {
        const b = imageFilters.brightness ?? 100;
        const c = imageFilters.contrast ?? 100;
        const s = imageFilters.saturation ?? 100;
        const h = imageFilters.hueRotate ?? 0;
        const bl = imageFilters.blur ?? 0;
        const g = imageFilters.grayscale ?? 0;
        const sp = imageFilters.sepia ?? 0;
        const inv = imageFilters.invert ? ' invert(100%)' : '';
        return `brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg) blur(${bl}px) grayscale(${g}%) sepia(${sp}%)${inv}`;
      }
      const baseFilter = `brightness(${screenshotFilter.brightness}) contrast(${screenshotFilter.contrast}) saturate(${screenshotFilter.saturation}) hue-rotate(${(screenshotFilter.hue || 0) * 3.6}deg) blur(${screenshotFilter.blur || 0}px)`;
      const advancedFilter = `sepia(${(effectsAdvanced.sepia || 0) * 0.5}%) grayscale(${effectsAdvanced.grayscale || 0}%) invert(${(effectsAdvanced.invert || 0) * 0.01})`;
      return `${baseFilter} ${advancedFilter}`;
    };

    // Get text position styles
    const getTextPositionStyles = (position: string) => {
      const posMap: Record<string, Record<string, string | number>> = {
        "top-left": { top: "10px", left: "10px" },
        "top-center": { top: "10px", left: "50%", transform: "translateX(-50%)" },
        "top-right": { top: "10px", right: "10px" },
        "center": { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
        "bottom-left": { bottom: "10px", left: "10px" },
        "bottom-center": { bottom: "10px", left: "50%", transform: "translateX(-50%)" },
        "bottom-right": { bottom: "10px", right: "10px" },
      };
      return posMap[position] || posMap["bottom-center"];
    };

    // For image mode - render without frame
    if (mode === "image" && imageUrl) {
      const cropStyle = cropSettings.enabled 
        ? {
            clipPath: `inset(${cropSettings.top}% ${100 - cropSettings.left - cropSettings.width}% ${100 - cropSettings.top - cropSettings.height}% ${cropSettings.left}%)`,
          }
        : {};

      return (
        <div
          ref={ref}
          className="preview-capture inline-block min-w-full relative"
          style={{
            padding: `${screenshotPadding}px`,
            background: bgStyleMap[screenshotBgStyle],
          }}
        >
          <div className="relative inline-block w-full" style={{ opacity: screenshotOpacity, ...cropStyle }}>
            <img
              src={imageUrl}
              alt="Preview"
              style={{ 
                display: 'block',
                margin: '0 auto',
                width: '100%',
                height: 'auto',
                objectFit: imageAdjustments?.objectFit ?? 'contain',
                objectPosition: imageAdjustments?.objectPosition ?? 'center',
                borderRadius: `${imageAdjustments?.imageRadius ?? screenshotRadius}px`,
                border: screenshotBorder ? `${screenshotBorderWidth}px solid ${screenshotBorderColor}` : 'none',
                boxShadow: screenshotShadow ? `${shadowMap[screenshotShadowStrength]}, inset 0 0 ${(effectsAdvanced.glow || 0) * 2}px rgba(255,255,255,${(effectsAdvanced.glow || 0) * 0.1})` : 'none',
                filter: buildFilter(),
                transform: `scale(${(imageAdjustments?.scale ?? 100) / 100}) scaleX(${imageAdjustments?.flipH ? -1 : 1}) scaleY(${imageAdjustments?.flipV ? -1 : 1}) rotate(${imageAdjustments?.rotation ?? 0}deg)`,
                opacity: (imageAdjustments?.imageOpacity ?? 100) / 100,
                maxHeight: '600px',
                maxWidth: '100%'
              }}
            />
            {/* Vignette overlay */}
            {screenshotVignette > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: `${screenshotRadius}px`,
                  background: vignetteStyle,
                }}
              />
            )}
            {/* Tint overlay */}
            {screenshotTintOpacity > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: `${screenshotRadius}px`,
                  background: screenshotTintColor,
                  opacity: screenshotTintOpacity * 0.3,
                }}
              />
            )}
            {/* Text overlay */}
            {textOverlay.enabled && textOverlay.text && (
              <div
                className="absolute pointer-events-none font-bold"
                style={{
                  ...getTextPositionStyles(textOverlay.position),
                  fontSize: `${textOverlay.fontSize}px`,
                  color: textOverlay.color,
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  fontFamily: "Arial, sans-serif",
                  zIndex: 10,
                  maxWidth: "90%",
                  textAlign: "center",
                }}
              >
                {textOverlay.text}
              </div>
            )}
            {/* Glow/Shadow effect overlay */}
            {effectsAdvanced.shadow > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: `${screenshotRadius}px`,
                  background: `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,${effectsAdvanced.shadow * 0.1}) 100%)`,
                }}
              />
            )}
            {/* Image color overlay (duotone / tint) */}
            {imageOverlay?.colorOverlay && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: `${imageAdjustments?.imageRadius ?? screenshotRadius}px`,
                  background: imageOverlay.colorOverlayColor || '#ffffff',
                  opacity: (imageOverlay.colorOverlayOpacity ?? 50) / 100,
                  mixBlendMode: 'multiply',
                }}
              />
            )}
            {/* Grain / film noise overlay */}
            {imageOverlay?.grain && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: `${imageAdjustments?.imageRadius ?? screenshotRadius}px`,
                  backgroundImage: `url('${makeGrainUrl(imageOverlay.grainIntensity ?? 6, 123)}')`,
                  backgroundSize: 'cover',
                  opacity: Math.min(0.9, ((imageOverlay.grainIntensity ?? 6) / 100)),
                }}
              />
            )}
            {/* Gradient overlay */}
            {imageOverlay?.gradientOverlay && (
              <div className="absolute inset-0 pointer-events-none" style={{
                borderRadius: `${imageAdjustments?.imageRadius ?? screenshotRadius}px`,
                background: `linear-gradient(${imageOverlay.gradientDirection || 'to bottom'}, ${imageOverlay.gradientColor1 || '#000000'} 0%, ${imageOverlay.gradientColor2 || '#ffffff'} 100%)`,
                opacity: (imageOverlay.gradientOpacity ?? 30) / 100,
                mixBlendMode: 'overlay'
              }} />
            )}
            {/* Scanlines */}
            {imageOverlay?.scanlines && (
              <div className="absolute inset-0 pointer-events-none" style={{
                borderRadius: `${imageAdjustments?.imageRadius ?? screenshotRadius}px`,
                backgroundImage: `repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.06) 3px)`,
                opacity: 0.6
              }} />
            )}
            {/* Light leak */}
            {imageOverlay?.lightLeak && (
              <div className="absolute inset-0 pointer-events-none" style={{
                borderRadius: `${imageAdjustments?.imageRadius ?? screenshotRadius}px`,
                backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(255,94,95,0.25), transparent 20%), radial-gradient(circle at 90% 80%, rgba(255,196,0,0.18), transparent 20%)',
                mixBlendMode: 'screen',
                opacity: 0.9
              }} />
            )}
            {/* Simple polaroid frame */}
            {imageFrame === 'polaroid' && (
              <div className="absolute inset-0 pointer-events-none flex items-end justify-center" style={{ zIndex: 0 }}>
                <div style={{
                  width: 'calc(100% - 40px)',
                  height: 'auto',
                  background: '#fff',
                  padding: '16px',
                  paddingBottom: '48px',
                  transform: 'rotate(-1.5deg)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                }} />
                <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 25, color: '#111', fontSize: 12 }}>{polaroidCaption}</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // For code mode - render with frame
    return (
      <div className="preview-scroll-wrapper w-full overflow-x-auto overflow-y-hidden">
        <div
          ref={ref}
          className="preview-capture inline-block min-w-full"
          style={{
            padding: `${codeStyleConfig.layout.padding}px`,
            background: bg.cssValue,
          }}
        >
          <div
            className="relative border border-white/10 backdrop-blur-xl"
            style={{
              borderRadius,
              boxShadow: codeStyleConfig.decoration.dropShadow !== "none" ? "0 40px 100px rgba(0,0,0,0.5)" : "none",
              background: `rgba(2,6,23,0.8)`,
              borderWidth: `${codeStyleConfig.decoration.border.width}px`,
              transform: `perspective(1000px) rotateX(${codeStyleConfig.perspective3D.tiltX}deg) rotateY(${codeStyleConfig.perspective3D.tiltY}deg) scale(${codeStyleConfig.perspective3D.scale})`,
              ...(codeStyleConfig.layout.aspectRatio === "1:1" ? { aspectRatio: "1/1" } : {}),
              ...(codeStyleConfig.layout.aspectRatio === "16:9" ? { aspectRatio: "16/9" } : {}),
              ...(codeStyleConfig.layout.aspectRatio === "4:5" ? { aspectRatio: "4/5" } : {}),
            }}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                {codeStyleConfig.windowFrame.showButtons && (
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                )}
                <span className="text-[10px] font-medium opacity-50 text-white">{codeStyleConfig.windowFrame.titleText}</span>
              </div>
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 opacity-60" />
            </div>

            {/* Content */}
            <div className="preview-code">
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                showLineNumbers
                wrapLongLines={false}
                customStyle={{
                  margin: 0,
                  padding: "1.5rem",
                  fontSize: `${codeStyleConfig.typography.fontSize}px`,
                  background: "transparent",
                  lineHeight: codeStyleConfig.typography.lineHeight,
                  overflowX: "auto",
                  whiteSpace: "pre",
                  fontFamily: codeStyleConfig.typography.fontFamily === "jetbrains" ? "'JetBrains Mono', monospace" : "monospace",
                }}
                lineNumberStyle={{ opacity: 0.25, minWidth: "2.5em", paddingRight: "1em", userSelect: "none" }}
                codeTagProps={{ style: { backgroundColor: "transparent" } }}
                lineProps={() => ({ style: { display: "block", backgroundColor: "transparent" } })}
              >
                {code}
              </SyntaxHighlighter>
            </div>

            {/* Watermark */}
            {codeStyleConfig.watermark.opacity > 0 && (
              <div
                className="absolute flex items-center gap-1.5"
                style={{
                  bottom: codeStyleConfig.watermark.position.includes("bottom") ? "0.75rem" : "auto",
                  right: codeStyleConfig.watermark.position.includes("right") ? "1rem" : "auto",
                  left: codeStyleConfig.watermark.position.includes("left") ? "1rem" : "auto",
                  opacity: codeStyleConfig.watermark.opacity,
                }}
              >
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
  const [mode, setMode]         = useState<EditorMode>("image");
  const [code, setCode]         = useState(starterCode);
  const [language, setLanguage] = useState<EditorLanguage>("javascript");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Code style configuration
  const [codeStyleConfig, setCodeStyleConfig] = useState<CodeStyleConfig>(DEFAULT_CODE_STYLE_CONFIG);

  // UI state
  const [isExporting, setIsExporting]   = useState(false);
  const [isSupporting, setIsSupporting] = useState(false);
  const [mobileTab, setMobileTab]       = useState<MobileTab>("input");
  const [screenshotBorder, setScreenshotBorder] = useState(true);
  const [screenshotShadow, setScreenshotShadow] = useState(true);
  const [screenshotRadius, setScreenshotRadius] = useState(12);
  const [screenshotPadding, setScreenshotPadding] = useState(20);
  const [screenshotBgStyle, setScreenshotBgStyle] = useState<"gradient" | "solid" | "blur" | "none">("gradient");
  const [screenshotBgColor, setScreenshotBgColor] = useState("#1a1f2e");
  const [screenshotShadowStrength, setScreenshotShadowStrength] = useState<"light" | "medium" | "heavy">("medium");
  const [screenshotBorderColor, setScreenshotBorderColor] = useState("rgba(255,255,255,0.1)");
  const [screenshotBorderWidth, setScreenshotBorderWidth] = useState(2);
  const [screenshotFilter, setScreenshotFilter] = useState({ brightness: 1, contrast: 1, saturation: 1, hue: 0, blur: 0 });
  const [screenshotOpacity, setScreenshotOpacity] = useState(1);
  const [screenshotVignette, setScreenshotVignette] = useState(0);
  const [screenshotTintColor, setScreenshotTintColor] = useState("#ffffff");
  const [screenshotTintOpacity, setScreenshotTintOpacity] = useState(0);

  // New features: Text, Cropping, Advanced Effects
  const [textOverlay, setTextOverlay] = useState({ enabled: false, text: "Add text here", fontSize: 24, color: "#ffffff", position: "bottom-center" as "top-left" | "top-center" | "top-right" | "center" | "bottom-left" | "bottom-center" | "bottom-right" });
  const [cropSettings, setCropSettings] = useState({ enabled: false, left: 0, top: 0, width: 100, height: 100 });
  const [effectsAdvanced, setEffectsAdvanced] = useState({ glow: 0, shadow: 0, sepia: 0, grayscale: 0, invert: 0 });

  // Image editing state (new)
  const [imageFilters, setImageFilters] = useState<ImageFilters>(DEFAULT_IMAGE_FILTERS);
  const [imageAdjustments, setImageAdjustments] = useState<ImageAdjustments>(DEFAULT_IMAGE_ADJUSTMENTS);
  const [imageOverlay, setImageOverlay] = useState<ImageOverlay>(DEFAULT_IMAGE_OVERLAY);
  const [imageFrame, setImageFrame] = useState<ImageFrame>("none");
  const [glowColor, setGlowColor] = useState<string>("#a855f7");
  const [polaroidCaption, setPolaroidCaption] = useState<string>("");

  const previewRef  = useRef<HTMLDivElement>(null);
  const customizePanelRef = useRef<HTMLDivElement>(null);
  const lastScrollPositionRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formatterRef = useRef<() => Promise<void>>(async () => {});

  // Update code style config helper
  const updateCodeStyle = (updates: Partial<CodeStyleConfig>) => {
    setCodeStyleConfig(prev => ({ ...prev, ...updates }));
  };

  // Sync app theme from <html data-theme>
  useEffect(() => {
    const sync = () =>
      setAppTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // ─── SCROLL FIX: Use simple memory-based restoration ───
  useEffect(() => {
    const panel = customizePanelRef.current;
    if (!panel) return;

    // Store last known good scroll position
    let lastGoodScroll = panel.scrollTop;

    // Check scroll position periodically and restore if it changed unexpectedly
    const interval = setInterval(() => {
      // If scroll changed and we're not actively scrolling, restore it
      if (panel.scrollTop !== lastGoodScroll) {
        panel.scrollTop = lastGoodScroll;
      }
      lastGoodScroll = panel.scrollTop;
    }, 50);

    return () => clearInterval(interval);
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
        body: JSON.stringify({ eventType, path: '/editor', metadata: { mode, theme: codeStyleConfig.syntaxTheme, aspectRatio: codeStyleConfig.layout.aspectRatio, ...metadata } }),
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

  const [hdExport, setHdExport] = useState(false);

  const CustomizePanel = () => (
    <div ref={customizePanelRef} className={`rounded-[20px] lg:rounded-[24px] p-4 shadow-sm space-y-5 lg:max-h-[72vh] lg:overflow-y-auto custom-scrollbar h-[500px] md:h-auto overflow-y-auto ${surfaceClass}`}>
      <div className={`flex items-center justify-between border-b pb-3 sticky top-0 z-10 ${isDarkTheme ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-white"}`}>
        <span className={`text-sm font-bold ${headingClass}`}>Customization</span>
        <Sparkles className="h-4 w-4 text-fuchsia-400" />
      </div>

      {/* Background */}
      <section className="space-y-3">
        <label className={`block text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>
          {mode === "image" ? "Screenshot Display" : "Background"}
        </label>
        {mode === "code" ? (
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {(Object.keys(BACKGROUNDS) as BackgroundPreset[]).map(bgKey => {
              const bg = BACKGROUNDS[bgKey];
              return (
                <button 
                  key={bgKey} 
                  onClick={() => updateCodeStyle({ background: bgKey })}
                  className={`rounded-lg py-2 px-2 text-[9px] capitalize transition truncate`}
                  style={{
                    background: bg.previewColor,
                    border: codeStyleConfig.background === bgKey ? `2px solid cyan` : `1px solid rgba(255,255,255,0.1)`,
                    color: bg.previewColor === "#ffffff" || bg.previewColor === "#ffb3ba" ? "#000" : "#fff",
                  }}
                  title={bg.label}
                >
                  {bg.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-white/10 bg-slate-950/50 p-3">
            {/* Background Style */}
            <div className="space-y-2">
              <label className={`block text-[9px] font-bold uppercase text-slate-400`}>Background Style</label>
              <div className="grid grid-cols-4 gap-2">
                {(["gradient", "solid", "blur", "none"] as const).map(style => (
                  <button key={style} onClick={() => setScreenshotBgStyle(style)}
                    className={`rounded-lg py-1.5 text-[9px] font-medium capitalize transition ${
                      screenshotBgStyle === style
                        ? "border-cyan-400 bg-cyan-400/10 text-white"
                        : "border border-white/10 bg-slate-900 text-slate-400 hover:bg-white/5"
                    }`}
                  >{style}</button>
                ))}
              </div>
            </div>

            {/* Background Color (for solid mode) */}
            {screenshotBgStyle === "solid" && (
              <div className="space-y-2">
                <label className={`block text-[9px] font-bold uppercase text-slate-400`}>Color</label>
                <input type="color" value={screenshotBgColor} onChange={(e) => setScreenshotBgColor(e.target.value)} className="w-full h-8 rounded-lg cursor-pointer" />
              </div>
            )}

            {/* Padding */}
            <div className="space-y-2">
              <label className={`flex justify-between text-xs text-slate-300`}>
                Padding: <span className="font-mono">{screenshotPadding}px</span>
              </label>
              <input type="range" min="0" max="60" value={screenshotPadding} onChange={(e) => setScreenshotPadding(Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
              <label className={`flex justify-between text-xs text-slate-300`}>
                Radius: <span className="font-mono">{screenshotRadius}px</span>
              </label>
              <input type="range" min="0" max="32" value={screenshotRadius} onChange={(e) => setScreenshotRadius(Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>

            {/* Border Toggle and Color */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className={`flex items-center justify-between text-xs text-slate-300`}>
                Show Border
                <input type="checkbox" checked={screenshotBorder} onChange={(e) => setScreenshotBorder(e.target.checked)} className="accent-cyan-400 h-3.5 w-3.5" />
              </label>
              {screenshotBorder && (
                <>
                  <label className={`flex justify-between text-xs text-slate-300`}>
                    Width: <span className="font-mono">{screenshotBorderWidth}px</span>
                  </label>
                  <input type="range" min="1" max="8" value={screenshotBorderWidth} onChange={(e) => setScreenshotBorderWidth(Number(e.target.value))} className="w-full accent-fuchsia-500" />
                  <div className="space-y-1">
                    <label className={`block text-[9px] font-bold uppercase text-slate-400`}>Color</label>
                    <input type="color" value={screenshotBorderColor.includes("rgb") ? "#ffffff" : screenshotBorderColor} onChange={(e) => setScreenshotBorderColor(e.target.value)} className="w-full h-6 rounded-lg cursor-pointer" />
                  </div>
                </>
              )}
            </div>

            {/* Shadow */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className={`flex items-center justify-between text-xs text-slate-300`}>
                Drop Shadow
                <input type="checkbox" checked={screenshotShadow} onChange={(e) => setScreenshotShadow(e.target.checked)} className="accent-cyan-400 h-3.5 w-3.5" />
              </label>
              {screenshotShadow && (
                <>
                  <label className={`block text-[9px] font-bold uppercase text-slate-400`}>Strength</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["light", "medium", "heavy"] as const).map(strength => (
                      <button key={strength} onClick={() => setScreenshotShadowStrength(strength)}
                        className={`rounded-lg py-1.5 text-[9px] font-medium capitalize transition ${
                          screenshotShadowStrength === strength
                            ? "border-cyan-400 bg-cyan-400/10 text-white"
                            : "border border-white/10 bg-slate-900 text-slate-400 hover:bg-white/5"
                        }`}
                      >{strength}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Screenshot Opacity */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className={`flex justify-between text-xs text-slate-300`}>
                Opacity: <span className="font-mono">{(screenshotOpacity * 100).toFixed(0)}%</span>
              </label>
              <input type="range" min="0.1" max="1" step="0.05" value={screenshotOpacity} onChange={(e) => setScreenshotOpacity(Number(e.target.value))} className="w-full accent-fuchsia-500" />
            </div>

            {/* Image Filters */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className={`block text-[9px] font-bold uppercase text-slate-400`}>Image Effects</label>
              <label className={`flex justify-between text-xs text-slate-300`}>
                Brightness: <span className="font-mono">{(screenshotFilter.brightness * 100).toFixed(0)}%</span>
              </label>
              <input type="range" min="0.5" max="1.5" step="0.1" value={screenshotFilter.brightness} onChange={(e) => setScreenshotFilter({...screenshotFilter, brightness: Number(e.target.value)})} className="w-full accent-fuchsia-500" />
              
              <label className={`flex justify-between text-xs text-slate-300`}>
                Contrast: <span className="font-mono">{(screenshotFilter.contrast * 100).toFixed(0)}%</span>
              </label>
              <input type="range" min="0.5" max="1.5" step="0.1" value={screenshotFilter.contrast} onChange={(e) => setScreenshotFilter({...screenshotFilter, contrast: Number(e.target.value)})} className="w-full accent-fuchsia-500" />
              
              <label className={`flex justify-between text-xs text-slate-300`}>
                Saturation: <span className="font-mono">{(screenshotFilter.saturation * 100).toFixed(0)}%</span>
              </label>
              <input type="range" min="0.5" max="1.5" step="0.1" value={screenshotFilter.saturation} onChange={(e) => setScreenshotFilter({...screenshotFilter, saturation: Number(e.target.value)})} className="w-full accent-fuchsia-500" />

              <label className={`flex justify-between text-xs text-slate-300`}>
                Hue Rotate: <span className="font-mono">{(screenshotFilter.hue || 0) * 3.6}°</span>
              </label>
              <input type="range" min="0" max="100" value={screenshotFilter.hue || 0} onChange={(e) => setScreenshotFilter({...screenshotFilter, hue: Number(e.target.value)})} className="w-full accent-purple-500" />

              <label className={`flex justify-between text-xs text-slate-300`}>
                Blur: <span className="font-mono">{screenshotFilter.blur || 0}px</span>
              </label>
              <input type="range" min="0" max="20" step="0.5" value={screenshotFilter.blur || 0} onChange={(e) => setScreenshotFilter({...screenshotFilter, blur: Number(e.target.value)})} className="w-full accent-blue-500" />
            </div>

            {/* Vignette Effect */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className={`flex justify-between text-xs text-slate-300`}>
                Vignette: <span className="font-mono">{(screenshotVignette * 100).toFixed(0)}%</span>
              </label>
              <input type="range" min="0" max="1" step="0.05" value={screenshotVignette} onChange={(e) => setScreenshotVignette(Number(e.target.value))} className="w-full accent-indigo-500" />
            </div>

            {/* Tint Overlay */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className={`flex justify-between text-xs text-slate-300`}>
                Tint: <span className="font-mono">{(screenshotTintOpacity * 100).toFixed(0)}%</span>
              </label>
              <input type="range" min="0" max="1" step="0.05" value={screenshotTintOpacity} onChange={(e) => setScreenshotTintOpacity(Number(e.target.value))} className="w-full accent-cyan-500" />
              {screenshotTintOpacity > 0 && (
                <input type="color" value={screenshotTintColor} onChange={(e) => setScreenshotTintColor(e.target.value)} className="w-full h-6 rounded-lg cursor-pointer" />
              )}
            </div>
          </div>
        )}
      </section>

      {/* Box Styling - Code only */}
      {mode === "code" && (
      <section className="space-y-3">
        <label className={`block text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>Box Styling</label>
        <SliderRow label="Padding" valueLabel={`${codeStyleConfig.layout.padding}px`} value={codeStyleConfig.layout.padding} min={0} max={120} onChange={(v) => updateCodeStyle({ layout: { ...codeStyleConfig.layout, padding: v } })} />
        <SliderRow label="Radius" valueLabel={`${codeStyleConfig.decoration.cornerRadius}px`} value={codeStyleConfig.decoration.cornerRadius} min={0} max={64} onChange={(v) => updateCodeStyle({ decoration: { ...codeStyleConfig.decoration, cornerRadius: v } })} />
      </section>
      )}

      {/* 3D - Code only */}
      {mode === "code" && (
      <section className="space-y-3">
        <label className={`block text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>3D Perspective (Beta)</label>
        <SliderRow label="Tilt X" valueLabel={`${codeStyleConfig.perspective3D.tiltX}°`} value={codeStyleConfig.perspective3D.tiltX} min={-30} max={30} onChange={(v) => updateCodeStyle({ perspective3D: { ...codeStyleConfig.perspective3D, tiltX: v } })} tone="cyan" />
        <SliderRow label="Tilt Y" valueLabel={`${codeStyleConfig.perspective3D.tiltY}°`} value={codeStyleConfig.perspective3D.tiltY} min={-30} max={30} onChange={(v) => updateCodeStyle({ perspective3D: { ...codeStyleConfig.perspective3D, tiltY: v } })} tone="cyan" />
      </section>
      )}

      {/* Window Chrome - Code only */}
      {mode === "code" && (
      <section className="space-y-3">
        <label className={`block text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>Window Chrome</label>
        <input
          className={`w-full rounded-xl border px-3 py-2 text-xs outline-none transition focus:border-fuchsia-400 ${
            isDarkTheme ? "border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
          }`}
          placeholder="Window title..." value={codeStyleConfig.windowFrame.titleText}
          onChange={e => updateCodeStyle({ windowFrame: { ...codeStyleConfig.windowFrame, titleText: e.target.value } })}
        />
        <label className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-xs ${
          isDarkTheme ? "border-white/10 bg-slate-950/50 text-slate-300" : "border-slate-200 bg-white text-slate-700"
        }`}>
          Show Window Buttons
          <input type="checkbox" checked={codeStyleConfig.windowFrame.showButtons} onChange={e => updateCodeStyle({ windowFrame: { ...codeStyleConfig.windowFrame, showButtons: e.target.checked } })} className="accent-fuchsia-500 h-3.5 w-3.5 ml-2" />
        </label>
      </section>
      )}

      {/* Watermark - Code only */}
      {mode === "code" && (
      <section className="space-y-3">
        <label className={`block text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>Watermark</label>
        <SliderRow label="Opacity" valueLabel={`${Math.round(codeStyleConfig.watermark.opacity * 100)}%`} value={codeStyleConfig.watermark.opacity} min={0} max={1} step={0.1} onChange={(v) => updateCodeStyle({ watermark: { ...codeStyleConfig.watermark, opacity: v } })} />
      </section>
      )}

      {/* Layout - Code only */}
      {mode === "code" && (
      <section className="space-y-3">
        <label className={`block text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>Layout</label>
        <div className="grid grid-cols-4 gap-2">
          {["free", "1:1", "16:9", "4:5"].map(a => (
            <button key={a} onClick={() => updateCodeStyle({ layout: { ...codeStyleConfig.layout, aspectRatio: a as any } })}
              className={`rounded-xl border py-2 text-[10px] transition ${
                codeStyleConfig.layout.aspectRatio === a
                  ? isDarkTheme ? "border-cyan-400 bg-cyan-400/10 text-white" : "border-cyan-400 bg-cyan-50 text-slate-900"
                  : isDarkTheme ? "border-white/10 bg-slate-950/50 text-slate-400 hover:bg-white/5" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >{a}</button>
          ))}
        </div>
      </section>
      )}

      {/* Text Overlay - Image only */}
      {mode === "image" && (
      <section className="space-y-3 pt-2 border-t border-slate-700/50">
        <label className={`flex items-center justify-between text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>
          Text Overlay
          <input type="checkbox" checked={textOverlay.enabled} onChange={e => setTextOverlay({...textOverlay, enabled: e.target.checked})} className="accent-fuchsia-500 h-3.5 w-3.5" />
        </label>
        {textOverlay.enabled && (
          <div className="space-y-2 rounded-xl border border-white/10 bg-slate-950/50 p-3">
            <input type="text" value={textOverlay.text} onChange={e => setTextOverlay({...textOverlay, text: e.target.value})} placeholder="Text to add..." className={`w-full rounded-lg border px-2 py-1.5 text-xs ${isDarkTheme ? "border-white/10 bg-slate-900 text-white" : "border-slate-200 bg-white"}`} />
            <div className="flex gap-2">
              <label className={`flex-1 flex justify-between text-xs text-slate-300`}>
                Size: <span className="font-mono">{textOverlay.fontSize}px</span>
              </label>
              <input type="range" min="10" max="72" value={textOverlay.fontSize} onChange={e => setTextOverlay({...textOverlay, fontSize: Number(e.target.value)})} className="flex-1 accent-cyan-500" />
            </div>
            <div className="flex gap-2">
              <label className={`text-xs text-slate-300`}>Color:</label>
              <input type="color" value={textOverlay.color} onChange={e => setTextOverlay({...textOverlay, color: e.target.value})} className="h-6 w-12 rounded cursor-pointer" />
            </div>
            <label className={`block text-[9px] font-bold uppercase text-slate-400`}>Position</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["top-left", "top-center", "top-right", "center", "bottom-left", "bottom-center", "bottom-right"] as const).map(pos => (
                <button key={pos} onClick={() => setTextOverlay({...textOverlay, position: pos})} className={`rounded text-[8px] font-medium py-1 ${textOverlay.position === pos ? "bg-cyan-400/20 border border-cyan-400 text-cyan-300" : "border border-white/10 text-slate-400 hover:bg-white/5"}`}>{pos.split("-").join("\n")}</button>
              ))}
            </div>
          </div>
        )}
      </section>
      )}

      {/* Cropping - Image only */}
      {mode === "image" && (
      <section className="space-y-3 pt-2 border-t border-slate-700/50">
        <label className={`flex items-center justify-between text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>
          Crop & Scale
          <input type="checkbox" checked={cropSettings.enabled} onChange={e => setCropSettings({...cropSettings, enabled: e.target.checked})} className="accent-fuchsia-500 h-3.5 w-3.5" />
        </label>
        {cropSettings.enabled && (
          <div className="space-y-2 rounded-xl border border-white/10 bg-slate-950/50 p-3">
            <label className={`flex justify-between text-xs text-slate-300`}>
              Width: <span className="font-mono">{cropSettings.width}%</span>
            </label>
            <input type="range" min="10" max="100" value={cropSettings.width} onChange={e => setCropSettings({...cropSettings, width: Number(e.target.value)})} className="w-full accent-cyan-500" />
            <label className={`flex justify-between text-xs text-slate-300`}>
              Height: <span className="font-mono">{cropSettings.height}%</span>
            </label>
            <input type="range" min="10" max="100" value={cropSettings.height} onChange={e => setCropSettings({...cropSettings, height: Number(e.target.value)})} className="w-full accent-cyan-500" />
          </div>
        )}
      </section>
      )}

      {/* Advanced Effects - Image only */}
      {mode === "image" && (
      <section className="space-y-3 pt-2 border-t border-slate-700/50">
        <label className={`block text-[10px] font-bold uppercase tracking-widest ${mutedClass}`}>Advanced Effects</label>
        <div className="space-y-2 rounded-xl border border-white/10 bg-slate-950/50 p-3">
          <label className={`flex justify-between text-xs text-slate-300`}>
            Glow: <span className="font-mono">{(effectsAdvanced.glow * 10).toFixed(0)}%</span>
          </label>
          <input type="range" min="0" max="10" step="0.5" value={effectsAdvanced.glow} onChange={e => setEffectsAdvanced({...effectsAdvanced, glow: Number(e.target.value)})} className="w-full accent-yellow-500" />

          <label className={`flex justify-between text-xs text-slate-300`}>
            Shadow: <span className="font-mono">{(effectsAdvanced.shadow * 100).toFixed(0)}%</span>
          </label>
          <input type="range" min="0" max="1" step="0.05" value={effectsAdvanced.shadow} onChange={e => setEffectsAdvanced({...effectsAdvanced, shadow: Number(e.target.value)})} className="w-full accent-gray-500" />

          <label className={`flex justify-between text-xs text-slate-300`}>
            Sepia: <span className="font-mono">{(effectsAdvanced.sepia * 100).toFixed(0)}%</span>
          </label>
          <input type="range" min="0" max="1" step="0.05" value={effectsAdvanced.sepia} onChange={e => setEffectsAdvanced({...effectsAdvanced, sepia: Number(e.target.value)})} className="w-full accent-orange-500" />

          <label className={`flex justify-between text-xs text-slate-300`}>
            Grayscale: <span className="font-mono">{(effectsAdvanced.grayscale * 100).toFixed(0)}%</span>
          </label>
          <input type="range" min="0" max="1" step="0.05" value={effectsAdvanced.grayscale} onChange={e => setEffectsAdvanced({...effectsAdvanced, grayscale: Number(e.target.value)})} className="w-full accent-slate-500" />

          <label className={`flex justify-between text-xs text-slate-300`}>
            Invert: <span className="font-mono">{(effectsAdvanced.invert * 100).toFixed(0)}%</span>
          </label>
          <input type="range" min="0" max="1" step="0.05" value={effectsAdvanced.invert} onChange={e => setEffectsAdvanced({...effectsAdvanced, invert: Number(e.target.value)})} className="w-full accent-red-500" />
        </div>
      </section>
      )}

      {/* Export */}
      <section className="space-y-3">
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
        <div className="lg:hidden space-y-4 min-h-[500px]">
          {mobileTab === "input"   && <InputPanel />}
          {mobileTab === "style"   && (
            <StyleControls
              background={codeStyleConfig.background as any}
              onBackgroundChange={(v) => updateCodeStyle({ background: v as any })}
              padding={screenshotPadding}
              onPaddingChange={setScreenshotPadding}
              radius={screenshotRadius}
              onRadiusChange={setScreenshotRadius}
              shadow={screenshotShadow}
              onShadowChange={setScreenshotShadow}
              theme={"dark" as any}
              onThemeChange={() => {}}
              fontSize={codeStyleConfig.typography.fontSize}
              onFontSizeChange={(n) => updateCodeStyle({ typography: { ...codeStyleConfig.typography, fontSize: n } })}
              lineNumbers={false}
              onLineNumbersChange={() => {}}
              layout={"centered"}
              onLayoutChange={() => {}}
              watermark={codeStyleConfig.watermark.opacity > 0}
              onWatermarkChange={(v) => updateCodeStyle({ watermark: { ...codeStyleConfig.watermark, opacity: v ? 0.3 : 0 } })}
              hdExport={hdExport}
              onHdExportChange={setHdExport}
              opacity={screenshotOpacity}
              onOpacityChange={setScreenshotOpacity}
              tiltX={codeStyleConfig.perspective3D.tiltX}
              onTiltXChange={(n) => updateCodeStyle({ perspective3D: { ...codeStyleConfig.perspective3D, tiltX: n } })}
              tiltY={codeStyleConfig.perspective3D.tiltY}
              onTiltYChange={(n) => updateCodeStyle({ perspective3D: { ...codeStyleConfig.perspective3D, tiltY: n } })}
              showWindowButtons={codeStyleConfig.windowFrame.showButtons}
              onShowWindowButtonsChange={(v) => updateCodeStyle({ windowFrame: { ...codeStyleConfig.windowFrame, showButtons: v } })}
              cardTitle={codeStyleConfig.windowFrame.titleText}
              onCardTitleChange={(s) => updateCodeStyle({ windowFrame: { ...codeStyleConfig.windowFrame, titleText: s } })}
              aspectRatio={codeStyleConfig.layout.aspectRatio as any}
              onAspectRatioChange={(a) => updateCodeStyle({ layout: { ...codeStyleConfig.layout, aspectRatio: a } })}
              borderWidth={screenshotBorderWidth}
              onBorderWidthChange={setScreenshotBorderWidth}
              // image props
              mode={mode}
              imageFilters={imageFilters}
              onImageFiltersChange={setImageFilters}
              onApplyImagePreset={(id) => setImageFilters(prev => ({ ...prev, ...(IMAGE_FILTER_PRESETS as any)[id] }))}
              imageAdjustments={imageAdjustments}
              onImageAdjustmentsChange={setImageAdjustments}
              imageOverlay={imageOverlay}
              onImageOverlayChange={setImageOverlay}
              imageFrame={imageFrame}
              onImageFrameChange={setImageFrame}
              glowColor={glowColor}
              onGlowColorChange={setGlowColor}
              polaroidCaption={polaroidCaption}
              onPolaroidCaptionChange={setPolaroidCaption}
            />
          )}
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
                    mode={mode}
                    imageUrl={imageUrl}
                    code={code}
                    language={language}
                    codeStyleConfig={codeStyleConfig}
                    screenshotBorder={screenshotBorder}
                    screenshotShadow={screenshotShadow}
                    screenshotRadius={screenshotRadius}
                    screenshotPadding={screenshotPadding}
                    screenshotBgStyle={screenshotBgStyle}
                    screenshotBgColor={screenshotBgColor}
                    screenshotShadowStrength={screenshotShadowStrength}
                    screenshotBorderColor={screenshotBorderColor}
                    screenshotBorderWidth={screenshotBorderWidth}
                    screenshotFilter={screenshotFilter}
                    screenshotOpacity={screenshotOpacity}
                    screenshotVignette={screenshotVignette}
                    screenshotTintColor={screenshotTintColor}
                    screenshotTintOpacity={screenshotTintOpacity}
                    textOverlay={textOverlay}
                    cropSettings={cropSettings}
                    effectsAdvanced={effectsAdvanced}
                    imageFilters={imageFilters}
                    imageAdjustments={imageAdjustments}
                    imageOverlay={imageOverlay}
                    imageFrame={imageFrame}
                    glowColor={glowColor}
                    polaroidCaption={polaroidCaption}
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
                  Live · <span className="font-mono">{codeStyleConfig.layout.aspectRatio}</span>
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
              <StyleControls
                background={codeStyleConfig.background as any}
                onBackgroundChange={(v) => updateCodeStyle({ background: v as any })}
                padding={screenshotPadding}
                onPaddingChange={setScreenshotPadding}
                radius={screenshotRadius}
                onRadiusChange={setScreenshotRadius}
                shadow={screenshotShadow}
                onShadowChange={setScreenshotShadow}
                theme={"dark" as any}
                onThemeChange={() => {}}
                fontSize={codeStyleConfig.typography.fontSize}
                onFontSizeChange={(n) => updateCodeStyle({ typography: { ...codeStyleConfig.typography, fontSize: n } })}
                lineNumbers={false}
                onLineNumbersChange={() => {}}
                layout={"centered"}
                onLayoutChange={() => {}}
                watermark={codeStyleConfig.watermark.opacity > 0}
                onWatermarkChange={(v) => updateCodeStyle({ watermark: { ...codeStyleConfig.watermark, opacity: v ? 0.3 : 0 } })}
                hdExport={hdExport}
                onHdExportChange={setHdExport}
                opacity={screenshotOpacity}
                onOpacityChange={setScreenshotOpacity}
                tiltX={codeStyleConfig.perspective3D.tiltX}
                onTiltXChange={(n) => updateCodeStyle({ perspective3D: { ...codeStyleConfig.perspective3D, tiltX: n } })}
                tiltY={codeStyleConfig.perspective3D.tiltY}
                onTiltYChange={(n) => updateCodeStyle({ perspective3D: { ...codeStyleConfig.perspective3D, tiltY: n } })}
                showWindowButtons={codeStyleConfig.windowFrame.showButtons}
                onShowWindowButtonsChange={(v) => updateCodeStyle({ windowFrame: { ...codeStyleConfig.windowFrame, showButtons: v } })}
                cardTitle={codeStyleConfig.windowFrame.titleText}
                onCardTitleChange={(s) => updateCodeStyle({ windowFrame: { ...codeStyleConfig.windowFrame, titleText: s } })}
                aspectRatio={codeStyleConfig.layout.aspectRatio as any}
                onAspectRatioChange={(a) => updateCodeStyle({ layout: { ...codeStyleConfig.layout, aspectRatio: a } })}
                borderWidth={screenshotBorderWidth}
                onBorderWidthChange={setScreenshotBorderWidth}
                // image props
                mode={mode}
                imageFilters={imageFilters}
                onImageFiltersChange={setImageFilters}
                onApplyImagePreset={(id) => setImageFilters(prev => ({ ...prev, ...(IMAGE_FILTER_PRESETS as any)[id] }))}
                imageAdjustments={imageAdjustments}
                onImageAdjustmentsChange={setImageAdjustments}
                imageOverlay={imageOverlay}
                onImageOverlayChange={setImageOverlay}
                imageFrame={imageFrame}
                onImageFrameChange={setImageFrame}
                glowColor={glowColor}
                onGlowColorChange={setGlowColor}
                polaroidCaption={polaroidCaption}
                onPolaroidCaptionChange={setPolaroidCaption}
              />
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
                    mode={mode}
                    imageUrl={imageUrl}
                    code={code}
                    language={language}
                    codeStyleConfig={codeStyleConfig}
                    screenshotBorder={screenshotBorder}
                    screenshotShadow={screenshotShadow}
                    screenshotRadius={screenshotRadius}
                    screenshotPadding={screenshotPadding}
                    screenshotBgStyle={screenshotBgStyle}
                    screenshotBgColor={screenshotBgColor}
                    screenshotShadowStrength={screenshotShadowStrength}
                    screenshotBorderColor={screenshotBorderColor}
                    screenshotBorderWidth={screenshotBorderWidth}
                    screenshotFilter={screenshotFilter}
                    screenshotOpacity={screenshotOpacity}
                    screenshotVignette={screenshotVignette}
                    screenshotTintColor={screenshotTintColor}
                    screenshotTintOpacity={screenshotTintOpacity}
                    textOverlay={textOverlay}
                    cropSettings={cropSettings}
                    effectsAdvanced={effectsAdvanced}
                    imageFilters={imageFilters}
                    imageAdjustments={imageAdjustments}
                    imageOverlay={imageOverlay}
                    imageFrame={imageFrame}
                    glowColor={glowColor}
                    polaroidCaption={polaroidCaption}
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
                Live Canvas Active &nbsp;·&nbsp; <span className="font-mono text-[10px]">{codeStyleConfig.layout.aspectRatio}</span>
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

        /* COMPREHENSIVE SCROLL FIX */
        .custom-scrollbar {
          scroll-behavior: auto !important;
          scroll-padding: 0 !important;
          overflow-anchor: none !important;
          position: relative;
        }
        
        /* Zero scroll-margin on all elements */
        .custom-scrollbar * {
          scroll-margin: 0 !important;
        }
      `}</style>
    </div>
  );
}

export default EditorStudio;