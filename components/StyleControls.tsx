"use client";

import { Shield, Sparkles, Box, Layout as LayoutIcon, Type, Eye } from "lucide-react";
import { Background, Theme, AspectRatio } from "./PreviewCard";
import { IMAGE_FILTER_PRESETS } from "../types/imageEditing";

type Layout = "centered" | "framed" | "card";

interface StyleControlsProps {
  background: Background;
  onBackgroundChange: (v: string) => void;
  padding: number;
  onPaddingChange: (v: number) => void;
  radius: number;
  onRadiusChange: (v: number) => void;
  shadow: boolean;
  onShadowChange: (v: boolean) => void;
  theme: Theme;
  onThemeChange: (v: Theme) => void;
  fontSize: number;
  onFontSizeChange: (v: number) => void;
  lineNumbers: boolean;
  onLineNumbersChange: (v: boolean) => void;
  layout: Layout;
  onLayoutChange: (v: Layout) => void;
  watermark: boolean;
  onWatermarkChange: (v: boolean) => void;
  hdExport: boolean;
  onHdExportChange: (v: boolean) => void;
  // New props
  opacity: number;
  onOpacityChange: (v: number) => void;
  tiltX: number;
  onTiltXChange: (v: number) => void;
  tiltY: number;
  onTiltYChange: (v: number) => void;
  showWindowButtons: boolean;
  onShowWindowButtonsChange: (v: boolean) => void;
  cardTitle: string;
  onCardTitleChange: (v: string) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (v: AspectRatio) => void;
  borderWidth: number;
  onBorderWidthChange: (v: number) => void;
  // optional mode to render image-only controls
  mode?: "image" | "code";
  // Image editing props (image mode only)
  imageFilters?: import("../types/imageEditing").ImageFilters;
  onImageFiltersChange?: (f: import("../types/imageEditing").ImageFilters) => void;
  onApplyImagePreset?: (id: import("../types/imageEditing").ImagePresetId) => void;
  imageAdjustments?: import("../types/imageEditing").ImageAdjustments;
  onImageAdjustmentsChange?: (a: import("../types/imageEditing").ImageAdjustments) => void;
  imageOverlay?: import("../types/imageEditing").ImageOverlay;
  onImageOverlayChange?: (o: import("../types/imageEditing").ImageOverlay) => void;
  imageFrame?: import("../types/imageEditing").ImageFrame;
  onImageFrameChange?: (f: import("../types/imageEditing").ImageFrame) => void;
  glowColor?: string;
  onGlowColorChange?: (c: string) => void;
  polaroidCaption?: string;
  onPolaroidCaptionChange?: (s: string) => void;
}

const backgrounds: Background[] = ["aurora", "sunset", "midnight", "emerald", "graphite", "glass"];
const layouts: Layout[] = ["centered", "framed", "card"];
const aspects: AspectRatio[] = ["free", "1:1", "16:9", "4:5", "9:16"];
const themes: { value: Theme; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "neon", label: "Neon" },
  { value: "ocean", label: "Ocean" },
  { value: "sunset", label: "Sunset" },
];

export function StyleControls({
  background, onBackgroundChange, padding, onPaddingChange, radius, onRadiusChange, shadow, onShadowChange,
  theme, onThemeChange, fontSize, onFontSizeChange, lineNumbers, onLineNumbersChange, layout, onLayoutChange,
  watermark, onWatermarkChange, hdExport, onHdExportChange, opacity, onOpacityChange, tiltX, onTiltXChange,
  tiltY, onTiltYChange, showWindowButtons, onShowWindowButtonsChange, cardTitle, onCardTitleChange,
  aspectRatio, onAspectRatioChange, borderWidth, onBorderWidthChange
  , mode = "code", imageFilters, onImageFiltersChange, onApplyImagePreset, imageAdjustments, onImageAdjustmentsChange, imageOverlay, onImageOverlayChange, imageFrame, onImageFrameChange, glowColor, onGlowColorChange, polaroidCaption, onPolaroidCaptionChange
}: StyleControlsProps) {
  return (
    <div className="max-h-[70vh] overflow-y-auto rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl custom-scrollbar">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white">Composition Controls</div>
        <Sparkles className="h-4 w-4 text-fuchsia-300" />
      </div>

      <div className="mt-5 space-y-6">
        {/* Background */}
        <section>
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
            <LayoutIcon className="h-3 w-3" /> Background Canvas
          </div>
          <div className="grid grid-cols-3 gap-2">
            {backgrounds.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onBackgroundChange(b)}
                className={`rounded-xl border px-2 py-2 text-center text-[10px] capitalize transition ${background === b ? "border-cyan-300 bg-cyan-400/10 text-white" : "border-white/10 bg-slate-950/50 text-slate-300 hover:bg-white/5"}`}
              >
                {b}
              </button>
            ))}
          </div>
        </section>

        {/* Framing & 3D */}
        <section>
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
            <Box className="h-3 w-3" /> Box Styling & 3D
          </div>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <label className="block text-xs text-slate-300">
              Padding {padding}px
              <input className="mt-2 w-full accent-fuchsia-500" type="range" min="0" max="120" value={padding} onChange={(e) => onPaddingChange(Number(e.target.value))} />
            </label>
            <label className="block text-xs text-slate-300">
              Glass Opacity {Math.round(opacity * 100)}%
              <input className="mt-2 w-full accent-fuchsia-500" type="range" min="0" max="1" step="0.05" value={opacity} onChange={(e) => onOpacityChange(Number(e.target.value))} />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-xs text-slate-300">
                Tilt X: {tiltX}°
                <input className="mt-2 w-full accent-cyan-500" type="range" min="-25" max="25" value={tiltX} onChange={(e) => onTiltXChange(Number(e.target.value))} />
              </label>
              <label className="block text-xs text-slate-300">
                Tilt Y: {tiltY}°
                <input className="mt-2 w-full accent-cyan-500" type="range" min="-25" max="25" value={tiltY} onChange={(e) => onTiltYChange(Number(e.target.value))} />
              </label>
            </div>
            <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
              Drop Shadow
              <input type="checkbox" checked={shadow} onChange={(e) => onShadowChange(e.target.checked)} />
            </label>
          </div>
        </section>

        {/* Editor Aesthetic */}
        <section>
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
            <Type className="h-3 w-3" /> Frame Aesthetics
          </div>
          <div className="space-y-3">
             <div className="grid grid-cols-2 gap-2">
               {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => onThemeChange(t.value)}
                    className={`rounded-xl border px-3 py-2 text-xs transition ${theme === t.value ? "border-fuchsia-300 bg-fuchsia-400/10 text-white" : "border-white/10 bg-slate-950/50 text-slate-300 hover:bg-white/5"}`}
                  >
                    {t.label}
                  </button>
               ))}
             </div>
             <input 
               className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2 text-xs text-white placeholder:text-slate-600 focus:border-fuchsia-400 outline-none"
               placeholder="Window title..."
               value={cardTitle}
               onChange={(e) => onCardTitleChange(e.target.value)}
             />
             <div className="flex gap-2">
                <label className="flex flex-1 items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-200">
                  macOS Buttons
                  <input type="checkbox" checked={showWindowButtons} onChange={(e) => onShowWindowButtonsChange(e.target.checked)} />
                </label>
                <label className="flex flex-1 items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-200">
                  Line #
                  <input type="checkbox" checked={lineNumbers} onChange={(e) => onLineNumbersChange(e.target.checked)} />
                </label>
             </div>
          </div>
        </section>
        {/* Image mode additional controls */}
        {mode === "image" && (
          <div className="mt-5 space-y-6">
            <section>
              <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">Image Filters</div>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(IMAGE_FILTER_PRESETS).map((k) => (
                    <button key={k} onClick={() => onApplyImagePreset?.(k as any)} className="rounded-md px-2 py-1 text-xs border border-white/10 bg-slate-800/60">{k}</button>
                  ))}
                </div>
                <label className="block text-xs text-slate-300">Brightness: {imageFilters?.brightness ?? 100}%</label>
                <input type="range" min={50} max={200} value={imageFilters?.brightness ?? 100} onChange={(e) => onImageFiltersChange?.({ ...(imageFilters as any), brightness: Number(e.target.value) })} className="w-full" />
                <label className="block text-xs text-slate-300">Contrast: {imageFilters?.contrast ?? 100}%</label>
                <input type="range" min={50} max={200} value={imageFilters?.contrast ?? 100} onChange={(e) => onImageFiltersChange?.({ ...(imageFilters as any), contrast: Number(e.target.value) })} className="w-full" />
                <label className="block text-xs text-slate-300">Saturation: {imageFilters?.saturation ?? 100}%</label>
                <input type="range" min={0} max={300} value={imageFilters?.saturation ?? 100} onChange={(e) => onImageFiltersChange?.({ ...(imageFilters as any), saturation: Number(e.target.value) })} className="w-full" />
                <label className="block text-xs text-slate-300">Hue Rotate: {imageFilters?.hueRotate ?? 0}°</label>
                <input type="range" min={0} max={360} value={imageFilters?.hueRotate ?? 0} onChange={(e) => onImageFiltersChange?.({ ...(imageFilters as any), hueRotate: Number(e.target.value) })} className="w-full" />
                <label className="block text-xs text-slate-300">Blur: {imageFilters?.blur ?? 0}px</label>
                <input type="range" min={0} max={20} value={imageFilters?.blur ?? 0} onChange={(e) => onImageFiltersChange?.({ ...(imageFilters as any), blur: Number(e.target.value) })} className="w-full" />
                <label className="block text-xs text-slate-300">Grayscale: {imageFilters?.grayscale ?? 0}%</label>
                <input type="range" min={0} max={100} value={imageFilters?.grayscale ?? 0} onChange={(e) => onImageFiltersChange?.({ ...(imageFilters as any), grayscale: Number(e.target.value) })} className="w-full" />
                <label className="block text-xs text-slate-300">Sepia: {imageFilters?.sepia ?? 0}%</label>
                <input type="range" min={0} max={100} value={imageFilters?.sepia ?? 0} onChange={(e) => onImageFiltersChange?.({ ...(imageFilters as any), sepia: Number(e.target.value) })} className="w-full" />
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">Image Adjustments</div>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <label className="block text-xs text-slate-300">Fit</label>
                <select value={imageAdjustments?.objectFit ?? 'contain'} onChange={(e) => onImageAdjustmentsChange?.({ ...(imageAdjustments as any), objectFit: e.target.value as any })} className="w-full p-2 rounded bg-slate-800 text-white">
                  <option value="contain">Contain</option>
                  <option value="cover">Cover</option>
                  <option value="fill">Fill</option>
                </select>
                <label className="block text-xs text-slate-300">Position</label>
                <select value={imageAdjustments?.objectPosition ?? 'center'} onChange={(e) => onImageAdjustmentsChange?.({ ...(imageAdjustments as any), objectPosition: e.target.value as any })} className="w-full p-2 rounded bg-slate-800 text-white">
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
                <label className="block text-xs text-slate-300">Scale: {imageAdjustments?.scale ?? 100}%</label>
                <input type="range" min={50} max={200} value={imageAdjustments?.scale ?? 100} onChange={(e) => onImageAdjustmentsChange?.({ ...(imageAdjustments as any), scale: Number(e.target.value) })} className="w-full" />
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs">Flip H<input type="checkbox" checked={imageAdjustments?.flipH ?? false} onChange={(e) => onImageAdjustmentsChange?.({ ...(imageAdjustments as any), flipH: e.target.checked })} /></label>
                  <label className="text-xs">Flip V<input type="checkbox" checked={imageAdjustments?.flipV ?? false} onChange={(e) => onImageAdjustmentsChange?.({ ...(imageAdjustments as any), flipV: e.target.checked })} /></label>
                </div>
                <label className="block text-xs text-slate-300">Rotation: {imageAdjustments?.rotation ?? 0}°</label>
                <input type="range" min={-180} max={180} value={imageAdjustments?.rotation ?? 0} onChange={(e) => onImageAdjustmentsChange?.({ ...(imageAdjustments as any), rotation: Number(e.target.value) })} className="w-full" />
                <label className="block text-xs text-slate-300">Opacity: {imageAdjustments?.imageOpacity ?? 100}%</label>
                <input type="range" min={20} max={100} value={imageAdjustments?.imageOpacity ?? 100} onChange={(e) => onImageAdjustmentsChange?.({ ...(imageAdjustments as any), imageOpacity: Number(e.target.value) })} className="w-full" />
                <label className="block text-xs text-slate-300">Radius: {imageAdjustments?.imageRadius ?? 8}px</label>
                <input type="range" min={0} max={48} value={imageAdjustments?.imageRadius ?? 8} onChange={(e) => onImageAdjustmentsChange?.({ ...(imageAdjustments as any), imageRadius: Number(e.target.value) })} className="w-full" />
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">Overlays & Frame</div>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <label className="flex items-center justify-between text-xs text-slate-300">Color Overlay<input type="checkbox" checked={imageOverlay?.colorOverlay ?? false} onChange={(e) => onImageOverlayChange?.({ ...(imageOverlay as any), colorOverlay: e.target.checked })} /></label>
                {imageOverlay?.colorOverlay && (
                  <div>
                    <input type="color" value={imageOverlay.colorOverlayColor} onChange={(e) => onImageOverlayChange?.({ ...(imageOverlay as any), colorOverlayColor: e.target.value })} className="h-8 w-full rounded" />
                    <label className="block text-xs">Opacity: {imageOverlay.colorOverlayOpacity}%</label>
                    <input type="range" min={0} max={80} value={imageOverlay.colorOverlayOpacity} onChange={(e) => onImageOverlayChange?.({ ...(imageOverlay as any), colorOverlayOpacity: Number(e.target.value) })} className="w-full" />
                  </div>
                )}
                <label className="flex items-center justify-between text-xs text-slate-300">Polaroid Frame<input type="checkbox" checked={imageFrame === 'polaroid'} onChange={(e) => onImageFrameChange?.(e.target.checked ? 'polaroid' : 'none')} /></label>
                {imageFrame === 'glow' && (
                  <div>
                    <label className="block text-xs">Glow Color</label>
                    <input type="color" value={glowColor} onChange={(e) => onGlowColorChange?.(e.target.value)} className="w-full h-8 rounded" />
                  </div>
                )}
                {imageFrame === 'polaroid' && (
                  <div>
                    <label className="block text-xs">Caption</label>
                    <input value={polaroidCaption} onChange={(e) => onPolaroidCaptionChange?.(e.target.value)} className="w-full p-2 rounded bg-slate-800 text-white" />
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Layout & Aspect */}
        <section>
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
            <Eye className="h-3 w-3" /> Output Sizing
          </div>
          <div className="space-y-3">
             <div className="flex gap-2">
               {aspects.map((a) => (
                  <button
                    key={a}
                    onClick={() => onAspectRatioChange(a)}
                    className={`flex-1 rounded-xl border px-2 py-2 text-[10px] transition ${aspectRatio === a ? "border-cyan-300 bg-cyan-400/10 text-white" : "border-white/10 bg-slate-950/50 text-slate-300 hover:bg-white/5"}`}
                  >
                    {a}
                  </button>
               ))}
             </div>
          </div>
        </section>

        {/* Premium Export */}
        <section className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Shield className="h-4 w-4 text-cyan-300" /> Premium Export
          </div>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              Watermark
              <input type="checkbox" checked={watermark} onChange={(e) => onWatermarkChange(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              3x HD (PNG)
              <input type="checkbox" checked={hdExport} onChange={(e) => onHdExportChange(e.target.checked)} />
            </label>
          </div>
        </section>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}