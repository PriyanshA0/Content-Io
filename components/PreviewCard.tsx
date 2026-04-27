"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { Copy, ShieldCheck, Sparkles } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface PreviewCardProps {
  mode: "image" | "code";
  imageUrl: string | null;
  code: string;
  language: "javascript" | "typescript" | "python" | "bash";
  background: string;
  padding: number;
  radius: number;
  shadow: boolean;
  theme: "dark" | "light" | "neon";
  layout: "centered" | "framed" | "card";
  fontSize: number;
  lineNumbers: boolean;
  watermark: boolean;
}

const themeStyles = {
  dark: vscDarkPlus,
  light: oneLight,
  neon: vscDarkPlus,
} as const;

const backgroundMap = {
  aurora: "linear-gradient(135deg, rgba(168,85,247,0.95) 0%, rgba(59,130,246,0.88) 45%, rgba(34,211,238,0.9) 100%)",
  sunset: "linear-gradient(135deg, rgba(236,72,153,0.95) 0%, rgba(168,85,247,0.9) 55%, rgba(59,130,246,0.88) 100%)",
  graphite: "linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(2,6,23,0.98) 100%)",
  glass: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
} as const;

export const PreviewCard = forwardRef<HTMLDivElement, PreviewCardProps>(function PreviewCard(
  {
    mode,
    imageUrl,
    code,
    language,
    background,
    padding,
    radius,
    shadow,
    theme,
    layout,
    fontSize,
    lineNumbers,
    watermark,
  },
  ref
) {
  const previewShadow = shadow ? "0 28px 90px rgba(0, 0, 0, 0.42)" : "none";
  const previewWidth = layout === "centered" ? "max-w-3xl" : layout === "framed" ? "max-w-5xl" : "max-w-2xl";
  const borderRadius = `${radius}px`;
  const innerRadius = `${Math.max(radius - 8, 18)}px`;
  const codeSurfaceClass = theme === "light" ? "bg-white" : "bg-slate-950";

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
        <span>Preview</span>
        <div className="flex items-center gap-2 text-[11px] tracking-[0.18em]">
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
          Live rendering
        </div>
      </div>

      <div
        ref={ref}
        className={`mx-auto w-full overflow-hidden border border-white/10 ${previewWidth}`}
        style={{
          padding,
          background:
            background in backgroundMap
              ? backgroundMap[background as keyof typeof backgroundMap]
              : backgroundMap.aurora,
          boxShadow: previewShadow,
          borderRadius,
        }}
      >
        <div
          className="border border-white/10 bg-slate-950/70 p-4 text-white"
          style={{ borderRadius: innerRadius }}
        >
          <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              contentio.preview
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              Ready for export
            </div>
          </div>

          {mode === "image" && imageUrl ? (
            <Image src={imageUrl} alt="Styled preview" width={1200} height={900} unoptimized className="max-h-[520px] w-full rounded-[22px] object-contain" />
          ) : (
            <div className={`rounded-[22px] ${codeSurfaceClass}`}>
              <SyntaxHighlighter
                language={language}
                style={themeStyles[theme]}
                showLineNumbers={lineNumbers}
                customStyle={{
                  margin: 0,
                  background: theme === "neon" ? "rgba(8, 13, 36, 0.78)" : "transparent",
                  fontSize,
                  padding: 0,
                  borderRadius: 0,
                }}
                lineNumberStyle={{ opacity: 0.45, minWidth: "2.5em", paddingRight: "1em" }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-400">
            <span>{layout} layout</span>
            <div className="flex items-center gap-3">
              <span>{padding}px padding</span>
              <span>{radius}px radius</span>
              <button type="button" className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white transition hover:bg-white/10">
                <Copy className="h-3.5 w-3.5" />
                Copy style
              </button>
            </div>
          </div>
        </div>

        {watermark ? (
          <div className="mt-4 text-right text-[11px] uppercase tracking-[0.22em] text-white/45">
            Made with ContentIo
          </div>
        ) : null}
      </div>
    </div>
  );
});
