"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, oneLight, coldarkDark, materialOceanic, synthwave84 } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { AspectRatio, Background, Mode, Theme } from "./EditorStudio";

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
}

const themeStyles = {
  dark: vscDarkPlus,
  light: oneLight,
  neon: synthwave84,
  ocean: materialOceanic,
  sunset: coldarkDark,
} as const;

const backgroundMap: Record<Background, string> = {
  aurora: "linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #22d3ee 100%)",
  sunset: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
  midnight: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
  emerald: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
  graphite: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  glass: "rgba(255, 255, 255, 0.05)",
};

export const PreviewCard = forwardRef<HTMLDivElement, PreviewCardProps>(function PreviewCard(
  {
    mode, imageUrl, code, language, background, padding, radius, shadow, theme, 
    layout, fontSize, lineNumbers, watermark, opacity, tiltX, tiltY, 
    showWindowButtons, cardTitle, aspectRatio, borderWidth
  },
  ref
) {
  const previewShadow = shadow ? "0 40px 100px rgba(0, 0, 0, 0.55)" : "none";
  const borderRadius = `${radius}px`;
  const innerRadius = `${Math.max(radius - 12, 12)}px`;
  
  const aspectClass = {
    "auto": "w-full",
    "1:1": "aspect-square w-full flex items-center justify-center",
    "16:9": "aspect-video w-full flex items-center justify-center",
    "4:5": "aspect-[4/5] w-full flex items-center justify-center",
  }[aspectRatio];

  const surfaceBg = theme === "light" 
    ? `rgba(255, 255, 255, ${opacity})` 
    : `rgba(2, 6, 23, ${opacity})`;

  const textClass = theme === "light" ? "text-slate-800" : "text-white";

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div
        ref={ref}
        className={`${aspectClass} overflow-hidden transition-all duration-300`}
        style={{
          padding: `${padding}px`,
          background: backgroundMap[background],
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
                  <span className="h-3 w-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                </div>
              )}
              <span className={`text-xs font-medium opacity-50 ${textClass}`}>{cardTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400 opacity-60" />
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {mode === "image" && imageUrl ? (
              <div className="relative overflow-hidden" style={{ borderRadius: innerRadius }}>
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="max-h-[500px] w-full object-contain" 
                />
              </div>
            ) : (
              <div className="overflow-hidden" style={{ borderRadius: innerRadius }}>
                <SyntaxHighlighter
                  language={language}
                  style={themeStyles[theme]}
                  showLineNumbers={lineNumbers}
                  wrapLines={true}
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
                    textAlign: "right",
                    userSelect: "none"
                  }}
                >
                  {code}
                </SyntaxHighlighter>
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
    </div>
  );
});