"use client";

import { forwardRef } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import type { ImageFilters, ImageAdjustments, ImageOverlay, ImageFrame } from "../types/imageEditing";
import { BACKGROUNDS } from "../lib/stylePresets";

/**
 * Types & Constants
 * We define these locally or import them to ensure the PreviewCard 
 * is perfectly synced with the EditorStudio logic.
 */
export type Mode = "image" | "code";
export type Theme = "dark" | "light" | "neon" | "ocean" | "sunset";
export type AspectRatio = "free" | "1:1" | "16:9" | "4:5" | "9:16";
export type Background = "aurora" | "sunset" | "midnight" | "emerald" | "graphite" | "glass" | "image-blur";

interface PreviewCardProps {
  mode: Mode;
  imageUrl: string | null;
  code: string;
  language: string;
  background: Background;
  padding: number;
  radius: number;
  shadow: boolean;
  theme: Theme;
  layout: string;
  fontSize: number;
  lineNumbers: boolean;
  watermark: boolean;
  opacity: number;
  tiltX: number;
  tiltY: number;
  showWindowButtons: boolean;
  cardTitle: string;
  aspectRatio: AspectRatio;
  borderWidth: number;
  imageFilters?: ImageFilters;
  imageAdjustments?: ImageAdjustments;
  imageOverlay?: ImageOverlay;
  imageFrame?: ImageFrame;
  glowColor?: string;
  polaroidCaption?: string;
}

/**
 * Enhanced Custom Syntax Highlighter
 * Uses regex to provide professional-looking colorization without 
 * relying on external libraries that cause build errors.
 */
const SimpleSyntaxHighlighter = ({ code, theme, fontSize }: { code: string; theme: Theme; fontSize: number }) => {
  const isLight = theme === 'light';
  
  const colors = {
    dark: { text: "#f8f8f2", keyword: "#ff79c6", string: "#f1fa8c", comment: "#6272a4" },
    light: { text: "#24292e", keyword: "#d73a49", string: "#032f62", comment: "#6a737d" },
    neon: { text: "#00ffff", keyword: "#ff00ff", string: "#ffff00", comment: "#4d4d4d" },
    ocean: { text: "#80cbc4", keyword: "#c792ea", string: "#c3e88d", comment: "#546e7a" },
    sunset: { text: "#a9b1d6", keyword: "#bb9af7", string: "#9ece6a", comment: "#565f89" },
  }[theme] || { text: "#ffffff", keyword: "#ff00ff", string: "#00ff00", comment: "#888" };

  const highlight = (codeText: string) => {
    return codeText
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\/\/.*/g, `<span style="color: ${colors.comment}">$&</span>`)
      .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|class|async|await)\b/g, `<span style="color: ${colors.keyword}; font-weight: bold;">$&</span>`)
      .replace(/(['"])(?:(?!\1|\\).|\\.)*\1/g, `<span style="color: ${colors.string}">$&</span>`);
  };

  return (
    <pre 
      className="p-6 font-mono leading-relaxed whitespace-pre overflow-x-auto custom-scrollbar"
      style={{ fontSize: `${fontSize}px`, color: colors.text }}
      dangerouslySetInnerHTML={{ __html: `<code>${highlight(code)}</code>` }}
    />
  );
};

const backgroundMap: Record<Background, string> = {
  aurora: "linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #22d3ee 100%)",
  sunset: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
  midnight: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
  emerald: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
  graphite: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  glass: "rgba(255, 255, 255, 0.05)",
  "image-blur": "transparent",
};

export const PreviewCard = forwardRef<HTMLDivElement, PreviewCardProps>(function PreviewCard(
  {
    mode, imageUrl, code, background, padding, radius, shadow, theme,
    fontSize, watermark, opacity, tiltX, tiltY,
    showWindowButtons, cardTitle, aspectRatio, borderWidth,
    imageFilters, imageAdjustments, imageOverlay, imageFrame, glowColor, polaroidCaption
  },
  ref
) {
  const previewShadow = shadow ? "0 40px 100px rgba(0, 0, 0, 0.55)" : "none";
  const borderRadius = `${radius}px`;
  const innerRadius = `${Math.max(radius - 12, 12)}px`;
  
  const aspectClassMap: Record<AspectRatio, string> = {
    "free": "w-full",
    "1:1": "aspect-square w-full flex items-center justify-center",
    "16:9": "aspect-video w-full flex items-center justify-center",
    "4:5": "aspect-[4/5] w-full flex items-center justify-center",
    "9:16": "aspect-[9/16] w-full flex items-center justify-center",
  };

  const surfaceBg = theme === "light" 
    ? `rgba(255, 255, 255, ${opacity})` 
    : `rgba(2, 6, 23, ${opacity})`;

  const textClass = theme === "light" ? "text-slate-800" : "text-white";

  // Helper: build CSS filter string from ImageFilters-like object
  const makeFilterString = (f: Partial<ImageFilters> | undefined) => {
    if (!f) return "";
    const brightness = f.brightness ?? 100;
    const contrast = f.contrast ?? 100;
    const saturation = f.saturation ?? 100;
    const hue = f.hueRotate ?? 0;
    const blurPx = f.blur ?? 0;
    const grayscale = f.grayscale ?? 0;
    const sepia = f.sepia ?? 0;
    const invert = f.invert ? " invert(100%)" : "";
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) blur(${blurPx}px) grayscale(${grayscale}%) sepia(${sepia}%)${invert}`;
  };

  // Grain SVG generator
  const makeGrainUrl = (intensity: number) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${Math.min(0.8, intensity/100)}' fill='black'/></svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  };

  // Find background preset value
  const preset = (BACKGROUNDS as any)[background];
  const bgValue = preset ? preset.cssValue : Object.values(BACKGROUNDS)[0].cssValue;

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div
        ref={ref}
        className={`${aspectClassMap[aspectRatio]} overflow-hidden transition-all duration-300`}
        style={{
          padding: `${padding}px`,
          background: bgValue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="relative w-full border border-white/10 backdrop-blur-xl transition-transform duration-500 ease-out"
          style={{
            borderRadius,
            boxShadow: previewShadow,
            background: surfaceBg,
            borderWidth: `${borderWidth}px`,
            transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-4">
              {showWindowButtons && (
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
              )}
              <span className={`text-xs font-medium opacity-50 ${textClass}`}>{cardTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400 opacity-60" />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 relative">
            {mode === "image" && imageUrl ? (
              <div className="relative overflow-hidden" style={{ borderRadius: innerRadius }}>
                {/* Background blurred image (image-blur background option) */}
                {background === "image-blur" && (
                  <img
                    src={imageUrl}
                    aria-hidden
                    alt=""
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "blur(40px)",
                      transform: "scale(1.15)",
                      opacity: 0.65,
                      zIndex: 0,
                    }}
                  />
                )}

                {/* Main image wrapper */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      objectFit: imageAdjustments?.objectFit ?? 'contain',
                      objectPosition: imageAdjustments?.objectPosition ?? 'center',
                      transform: `scale(${(imageAdjustments?.scale ?? 100) / 100}) scaleX(${imageAdjustments?.flipH ? -1 : 1}) scaleY(${imageAdjustments?.flipV ? -1 : 1}) rotate(${imageAdjustments?.rotation ?? 0}deg)`,
                      opacity: (imageAdjustments?.imageOpacity ?? 100) / 100,
                      borderRadius: `${imageAdjustments?.imageRadius ?? 8}px`,
                      filter: makeFilterString(imageFilters ?? undefined),
                      maxHeight: '600px',
                      maxWidth: '100%',
                      zIndex: 1,
                    }}
                    className="mx-auto"
                  />
                </div>

                {/* Overlays (all absolute, pointer-events:none) */}
                {/* Color Overlay */}
                {imageOverlay?.colorOverlay && (
                  <div style={{ position: 'absolute', inset: 0, background: imageOverlay.colorOverlayColor, opacity: ((imageOverlay.colorOverlayOpacity ?? 0) / 100), mixBlendMode: 'multiply', pointerEvents: 'none', zIndex: 10 }} />
                )}

                {/* Gradient Overlay */}
                {imageOverlay?.gradientOverlay && (
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(${imageOverlay.gradientDirection}, ${imageOverlay.gradientColor1}, ${imageOverlay.gradientColor2})`, opacity: ((imageOverlay.gradientOpacity ?? 0) / 100), pointerEvents: 'none', zIndex: 11 }} />
                )}

                {/* Vignette */}
                {imageOverlay?.vignette && (
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)', opacity: ((imageOverlay.vignetteIntensity ?? 0) / 100) }} />
                )}

                {/* Scanlines */}
                {imageOverlay?.scanlines && (
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 13, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)' }} />
                )}

                {/* Grain */}
                {imageOverlay?.grain && (
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 14, backgroundImage: makeGrainUrl(imageOverlay.grainIntensity ?? 6), opacity: 0.35, mixBlendMode: 'overlay' }} />
                )}

                {/* Light Leak */}
                {imageOverlay?.lightLeak && (
                  <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', pointerEvents: 'none', zIndex: 15, background: 'radial-gradient(circle,rgba(251,191,36,0.4),rgba(251,146,60,0.2),transparent 70%)', filter: 'blur(20px)' }} />
                )}

                {/* Polaroid caption support is handled via props.imageFrame === 'polaroid' in parent (not shown here) */}
              </div>
            ) : (
              <div className="overflow-hidden" style={{ borderRadius: innerRadius }}>
                {/* Keep code mode exactly as before */}
                <div className="p-6 font-mono leading-relaxed whitespace-pre overflow-x-auto custom-scrollbar" style={{ fontSize: `${fontSize}px`, color: textClass === 'text-slate-800' ? '#24292e' : '#f8f8f2' }}>
                  {/* Reuse simple highlighter fallback */}
                  {code}
                </div>
              </div>
            )}
          </div>

          {/* Footer Watermark */}
          {watermark && (
            <div className="absolute bottom-4 right-6 flex items-center gap-2 opacity-30">
              <Sparkles className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                ContentIo
              </span>
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