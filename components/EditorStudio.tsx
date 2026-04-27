"use client";

import { useMemo, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { FileCode2, ImagePlus, Save } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { UploadBox } from "@/components/UploadBox";
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewCard } from "@/components/PreviewCard";
import { StyleControls } from "@/components/StyleControls";
import { ExportButton } from "@/components/ExportButton";

const starterCode = `const product = "ContentIo";

function launch() {
  return {
    headline: "Ship polished content fast",
    vibe: "glass + gradients + social-ready exports",
  };
}

console.log(launch());`;

type Mode = "image" | "code";
type Theme = "dark" | "light" | "neon";
type Layout = "centered" | "framed" | "card";
type Background = "aurora" | "sunset" | "graphite" | "glass";
type Language = "javascript" | "typescript" | "python" | "bash";

export function EditorStudio() {
  const [mode, setMode] = useState<Mode>("image");
  const [code, setCode] = useState(starterCode);
  const [language, setLanguage] = useState<Language>("javascript");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [background, setBackground] = useState<Background>("aurora");
  const [padding, setPadding] = useState(48);
  const [radius, setRadius] = useState(28);
  const [shadow, setShadow] = useState(true);
  const [theme, setTheme] = useState<Theme>("dark");
  const [fontSize, setFontSize] = useState(16);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [layout, setLayout] = useState<Layout>("card");
  const [watermark, setWatermark] = useState(true);
  const [hdExport, setHdExport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Save draft");
  const previewRef = useRef<HTMLDivElement | null>(null);

  const totalChars = useMemo(() => code.length, [code]);

  const handleImageSelected = (nextImage: string) => {
    setMode("image");
    setImageUrl(nextImage);
  };

  const handleExport = async () => {
    if (!previewRef.current) {
      return;
    }

    setIsExporting(true);

    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: hdExport ? 3 : 2,
        backgroundColor: "#050816",
      });

      const link = document.createElement("a");
      link.download = `contentio-${mode}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveLabel("Saving...");

    try {
      const response = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: mode === "image" ? "Image composition" : code.slice(0, 28) || "Code composition",
          mode,
          imageUrl,
          code,
          language,
          settings: {
            background,
            padding,
            radius,
            shadow,
            theme,
            layout,
            fontSize,
            lineNumbers,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("save failed");
      }

      const payload = (await response.json()) as { saved?: boolean };
      setSaveLabel(payload.saved ? "Saved to database" : "Saved as draft");
    } catch {
      setSaveLabel("Save draft");
    } finally {
      setIsSaving(false);
      window.setTimeout(() => setSaveLabel("Save draft"), 1800);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Editor</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Build a polished screenshot or code card in real time.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Upload an image, paste code, customize the glass layout, and export a high-quality social-ready PNG.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saveLabel}
            </button>
            <ExportButton onExport={handleExport} isExporting={isExporting} hdExport={hdExport} />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <div className="flex gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-1">
                <button
                  type="button"
                  onClick={() => setMode("image")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${mode === "image" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/5"}`}
                >
                  <ImagePlus className="h-4 w-4" />
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => setMode("code")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${mode === "code" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/5"}`}
                >
                  <FileCode2 className="h-4 w-4" />
                  Paste Code
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {mode === "image" ? (
                  <UploadBox imageUrl={imageUrl} onImageSelected={handleImageSelected} />
                ) : (
                  <CodeEditor code={code} onCodeChange={setCode} language={language} onLanguageChange={setLanguage} />
                )}
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-400">
                  Live input length: <span className="font-semibold text-white">{totalChars}</span> characters.
                </div>
              </div>
            </div>

            <StyleControls
              background={background}
              onBackgroundChange={(value) => setBackground(value as Background)}
              padding={padding}
              onPaddingChange={setPadding}
              radius={radius}
              onRadiusChange={setRadius}
              shadow={shadow}
              onShadowChange={setShadow}
              theme={theme}
              onThemeChange={setTheme}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              lineNumbers={lineNumbers}
              onLineNumbersChange={setLineNumbers}
              layout={layout}
              onLayoutChange={setLayout}
              watermark={watermark}
              onWatermarkChange={setWatermark}
              hdExport={hdExport}
              onHdExportChange={setHdExport}
            />
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
            layout={layout}
            fontSize={fontSize}
            lineNumbers={lineNumbers}
            watermark={watermark}
          />
        </div>
      </section>
    </main>
  );
}
