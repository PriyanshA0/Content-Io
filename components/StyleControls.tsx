"use client";

import { Shield, Sparkles } from "lucide-react";

interface StyleControlsProps {
  background: string;
  onBackgroundChange: (value: string) => void;
  padding: number;
  onPaddingChange: (value: number) => void;
  radius: number;
  onRadiusChange: (value: number) => void;
  shadow: boolean;
  onShadowChange: (value: boolean) => void;
  theme: "dark" | "light" | "neon";
  onThemeChange: (value: "dark" | "light" | "neon") => void;
  fontSize: number;
  onFontSizeChange: (value: number) => void;
  lineNumbers: boolean;
  onLineNumbersChange: (value: boolean) => void;
  layout: "centered" | "framed" | "card";
  onLayoutChange: (value: "centered" | "framed" | "card") => void;
  watermark: boolean;
  onWatermarkChange: (value: boolean) => void;
  hdExport: boolean;
  onHdExportChange: (value: boolean) => void;
}

const backgroundOptions = ["aurora", "sunset", "graphite", "glass"] as const;
const layoutOptions = ["centered", "framed", "card"] as const;
const themeOptions = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "neon", label: "Neon" },
] as const;

export function StyleControls({
  background,
  onBackgroundChange,
  padding,
  onPaddingChange,
  radius,
  onRadiusChange,
  shadow,
  onShadowChange,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  lineNumbers,
  onLineNumbersChange,
  layout,
  onLayoutChange,
  watermark,
  onWatermarkChange,
  hdExport,
  onHdExportChange,
}: StyleControlsProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Customize</div>
          <div className="text-xs text-slate-400">Tune the composition before you export.</div>
        </div>
        <Sparkles className="h-4 w-4 text-fuchsia-300" />
      </div>

      <div className="mt-5 space-y-5">
        <section>
          <div className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-400">Background</div>
          <div className="grid grid-cols-2 gap-2">
            {backgroundOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onBackgroundChange(option)}
                className={`rounded-2xl border px-3 py-3 text-left text-sm capitalize transition ${background === option ? "border-cyan-300 bg-cyan-400/10 text-white" : "border-white/10 bg-slate-950/50 text-slate-300 hover:bg-white/5"}`}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-400">Style</div>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <label className="block text-sm text-slate-300">
              Padding {padding}px
              <input className="mt-2 w-full" type="range" min="20" max="96" value={padding} onChange={(event) => onPaddingChange(Number(event.target.value))} />
            </label>
            <label className="block text-sm text-slate-300">
              Border radius {radius}px
              <input className="mt-2 w-full" type="range" min="16" max="48" value={radius} onChange={(event) => onRadiusChange(Number(event.target.value))} />
            </label>
            <label className="block text-sm text-slate-300">
              Font size {fontSize}px
              <input className="mt-2 w-full" type="range" min="12" max="22" value={fontSize} onChange={(event) => onFontSizeChange(Number(event.target.value))} />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
              Shadow
              <input type="checkbox" checked={shadow} onChange={(event) => onShadowChange(event.target.checked)} />
            </label>
          </div>
        </section>

        <section>
          <div className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-400">Code Styling</div>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onThemeChange(option.value)}
                className={`rounded-2xl border px-3 py-3 text-sm transition ${theme === option.value ? "border-fuchsia-300 bg-fuchsia-400/10 text-white" : "border-white/10 bg-slate-950/50 text-slate-300 hover:bg-white/5"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <label className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-slate-200">
            Line numbers
            <input type="checkbox" checked={lineNumbers} onChange={(event) => onLineNumbersChange(event.target.checked)} />
          </label>
        </section>

        <section>
          <div className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-400">Layout</div>
          <div className="grid grid-cols-3 gap-2">
            {layoutOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onLayoutChange(option)}
                className={`rounded-2xl border px-3 py-3 text-sm capitalize transition ${layout === option ? "border-cyan-300 bg-cyan-400/10 text-white" : "border-white/10 bg-slate-950/50 text-slate-300 hover:bg-white/5"}`}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Shield className="h-4 w-4 text-cyan-300" />
            Premium options
          </div>
          <div className="mt-3 space-y-3 text-sm text-slate-300">
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              Remove watermark
              <input type="checkbox" checked={watermark} onChange={(event) => onWatermarkChange(event.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              HD export
              <input type="checkbox" checked={hdExport} onChange={(event) => onHdExportChange(event.target.checked)} />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
