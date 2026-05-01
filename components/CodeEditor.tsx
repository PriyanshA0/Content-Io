"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center gap-2 text-xs text-slate-500">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fuchsia-400 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:300ms]" />
    </div>
  ),
});

type Lang = "javascript" | "typescript" | "python" | "bash" | "java" | "cpp";

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  language: Lang;
  onLanguageChange: (language: Lang) => void;
  onRegisterFormatter?: (format: () => Promise<void>) => void;
}

const LANGUAGES: Lang[] = ["javascript", "typescript", "python", "bash", "java", "cpp"];

// Display labels so they fit on small screens
const LANG_LABELS: Record<Lang, string> = {
  javascript: "JS",
  typescript: "TS",
  python:     "Py",
  bash:       "Bash",
  java:       "Java",
  cpp:        "C++",
};

export function CodeEditor({
  code,
  onCodeChange,
  language,
  onLanguageChange,
  onRegisterFormatter,
}: CodeEditorProps) {
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [monacoInstance, setMonacoInstance] = useState<any>(null);
  const [editorTheme, setEditorTheme] = useState<"vs" | "vs-dark">("vs");

  // ── Sync Monaco theme with app <html data-theme> ──────────────────────────
  useEffect(() => {
    const sync = () => {
      setEditorTheme(
        document.documentElement.dataset.theme === "dark" ? "vs-dark" : "vs"
      );
    };
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  // ── Auto-format when language changes ────────────────────────────────────
  useEffect(() => {
    if (!editorInstance) return;
    const t = setTimeout(async () => {
      try {
        const action = editorInstance.getAction("editor.action.formatDocument");
        if (action) await action.run();
      } catch { /* some langs have no formatter — ignore */ }
    }, 120);
    return () => clearTimeout(t);
  }, [language, editorInstance]);

  const handleMount = (editor: any, monaco: any) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);

    // ── Custom Monaco theme — matches the dark editor surface ──────────────
    monaco.editor.defineTheme("contentio-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background":          "#080e1a",
        "editor.lineHighlightBackground": "#ffffff08",
        "editorLineNumber.foreground":    "#3a4a6a",
        "editorLineNumber.activeForeground": "#6272a4",
        "editorCursor.foreground":        "#a78bfa",
        "editor.selectionBackground":     "#7c3aed33",
        "scrollbarSlider.background":     "#ffffff12",
        "scrollbarSlider.hoverBackground":"#a855f730",
        "scrollbarSlider.activeBackground":"#a855f750",
      },
    });

    monaco.editor.defineTheme("contentio-light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background":              "#f8fafc",
        "editor.lineHighlightBackground": "#f1f5f9",
        "editorLineNumber.foreground":    "#cbd5e1",
        "editorLineNumber.activeForeground": "#94a3b8",
        "editorCursor.foreground":        "#7c3aed",
        "editor.selectionBackground":     "#7c3aed22",
        "scrollbarSlider.background":     "#00000010",
        "scrollbarSlider.hoverBackground":"#a855f720",
      },
    });

    const currentTheme =
      document.documentElement.dataset.theme === "dark"
        ? "contentio-dark"
        : "contentio-light";
    monaco.editor.setTheme(currentTheme);

    // Register formatter for parent
    const formatFn = async () => {
      try {
        const action = editor.getAction("editor.action.formatDocument");
        if (action) await action.run();
      } catch { /* noop */ }
    };
    onRegisterFormatter?.(formatFn);

    // Auto-format on mount
    setTimeout(formatFn, 300);
  };

  // ── Keep Monaco theme in sync when app theme changes ─────────────────────
  useEffect(() => {
    if (!monacoInstance) return;
    monacoInstance.editor.setTheme(
      editorTheme === "vs-dark" ? "contentio-dark" : "contentio-light"
    );
  }, [editorTheme, monacoInstance]);

  const isDark = editorTheme === "vs-dark";

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        isDark
          ? "border-white/10 bg-[#080e1a]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      {/* ── Compact header ───────────────────────────────────────────────── */}
      <div
        className={`flex items-center justify-between gap-2 border-b px-3 py-2 ${
          isDark ? "border-white/[0.07]" : "border-slate-200"
        }`}
      >
        {/* Title */}
        <div className="flex items-center gap-2 min-w-0">
          {/* macOS dots */}
          <div className="flex gap-1 shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className={`text-[11px] font-medium truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            {language}.snippet
          </span>
        </div>

        {/* Language pills — scrollable on tiny screens */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onLanguageChange(lang)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                language === lang
                  ? isDark
                    ? "bg-fuchsia-500/20 text-fuchsia-200 ring-1 ring-fuchsia-500/40"
                    : "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200"
                  : isDark
                    ? "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Monaco editor — tight line height, no word wrap ──────────────── */}
      <div className="h-[240px] sm:h-[290px] lg:h-[340px]">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={(v) => onCodeChange(v ?? "")}
          onMount={handleMount}
          theme={isDark ? "contentio-dark" : "contentio-light"}
          options={{
            // ── Layout ──────────────────────────────────────────────────
            minimap:            { enabled: false },
            scrollbar: {
              vertical:           "auto",
              horizontal:         "auto",
              verticalScrollbarSize:   6,
              horizontalScrollbarSize: 6,
              useShadows:         false,
            },
            padding:            { top: 12, bottom: 12 },
            scrollBeyondLastLine: false,
            automaticLayout:    true,

            // ── Typography ───────────────────────────────────────────────
            fontSize:           13,
            lineHeight:         20,       // tight — 20px per line (was ~24-28)
            fontFamily:         "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures:      true,
            letterSpacing:      0,

            // ── Behaviour ───────────────────────────────────────────────
            wordWrap:           "off",    // NO wrap — lines stay on one line
            lineNumbers:        "on",
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            glyphMargin:        false,
            folding:            true,
            foldingHighlight:   false,
            renderLineHighlight:"line",
            cursorBlinking:     "smooth",
            cursorSmoothCaretAnimation: "on",

            // ── Editing ─────────────────────────────────────────────────
            formatOnPaste:      true,
            formatOnType:       false,    // false — prevents mid-type reformatting
            tabSize:            2,
            insertSpaces:       true,
            detectIndentation:  true,

            // ── Aesthetics ──────────────────────────────────────────────
            renderWhitespace:   "none",
            guides: {
              indentation:      true,
              bracketPairs:     true,
            },
            bracketPairColorization: { enabled: true },
            smoothScrolling:    true,
            mouseWheelZoom:     false,
            contextmenu:        true,
            quickSuggestions:   { other: true, comments: false, strings: false },
            parameterHints:     { enabled: true },
            suggest:            { showKeywords: true, showSnippets: true },
            overviewRulerBorder: false,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
          }}
        />
      </div>

      {/* ── Status bar ───────────────────────────────────────────────────── */}
      <div
        className={`flex items-center justify-between border-t px-3 py-1.5 ${
          isDark ? "border-white/[0.07]" : "border-slate-200"
        }`}
      >
        <span className={`text-[10px] font-medium ${isDark ? "text-slate-600" : "text-slate-400"}`}>
          {code.split("\n").length} lines · {code.length} chars
        </span>
        <span className={`text-[10px] font-medium ${isDark ? "text-slate-600" : "text-slate-400"}`}>
          UTF-8
        </span>
      </div>

      <style jsx global>{`
        /* Hide horizontal scrollbar track but keep scrollability */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Monaco scrollbars — match brand */
        .monaco-scrollable-element > .scrollbar.vertical > .slider,
        .monaco-scrollable-element > .scrollbar.horizontal > .slider {
          border-radius: 999px !important;
          background: linear-gradient(135deg, #a855f7, #22d3ee) !important;
          opacity: 0.5;
        }
        .monaco-scrollable-element > .scrollbar.vertical > .slider:hover,
        .monaco-scrollable-element > .scrollbar.horizontal > .slider:hover {
          opacity: 0.85;
        }

        /* Remove Monaco's default outer border/glow */
        .monaco-editor .overflow-guard { border-radius: 0 !important; }
        .monaco-editor { outline: none !important; }
      `}</style>
    </div>
  );
}