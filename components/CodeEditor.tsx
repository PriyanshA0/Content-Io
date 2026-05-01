"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-slate-400">
      Loading editor...
    </div>
  ),
});

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  language: "javascript" | "typescript" | "python" | "bash" | "java" | "cpp";
  onLanguageChange: (
    language: "javascript" | "typescript" | "python" | "bash" | "java" | "cpp"
  ) => void;
  onRegisterFormatter?: (format: () => Promise<void>) => void;
}

const languages = [
  "javascript",
  "typescript",
  "python",
  "bash",
  "java",
  "cpp",
] as const;

export function CodeEditor({
  code,
  onCodeChange,
  language,
  onLanguageChange,
  onRegisterFormatter,
}: CodeEditorProps) {
  const [editorApi, setEditorApi] = useState<any>(null);
  const [editorTheme, setEditorTheme] = useState<"vs" | "vs-dark">("vs");

  // Sync Monaco theme with app theme
  useEffect(() => {
    const syncTheme = () => {
      const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "vs-dark" : "vs";
      setEditorTheme(nextTheme);
    };
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Re-format whenever language or code changes (auto-align)
  useEffect(() => {
    if (!editorApi) return;
    const timer = setTimeout(async () => {
      try {
        const action = editorApi.editor.getAction(
          "editor.action.formatDocument"
        );
        if (action) await action.run();
      } catch {
        // formatter not available for all languages, ignore
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [language, editorApi]);

  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/60">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Paste code</div>
          <div className="text-xs text-slate-400">
            Syntax-highlighted editing with live preview.
          </div>
        </div>
        {/* Language selector — wraps on mobile */}
        <div className="flex flex-wrap gap-1.5">
          {languages.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onLanguageChange(item)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize transition sm:px-3 sm:py-1.5 sm:text-xs ${
                language === item
                  ? "bg-white text-slate-950"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Editor — responsive height */}
      <div className="h-[260px] sm:h-[320px] lg:h-[380px]">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => onCodeChange(value ?? "")}
          onMount={(editor, monaco) => {
            setEditorApi({ editor, monaco });

            // Register format function for external callers
            const formatFn = async () => {
              try {
                const action = editor.getAction(
                  "editor.action.formatDocument"
                );
                if (action) await action.run();
              } catch {
                // noop
              }
            };
            if (typeof onRegisterFormatter === "function") {
              onRegisterFormatter(formatFn);
            }

            // Auto-format on initial mount after a short delay
            setTimeout(async () => {
              try {
                const action = editor.getAction(
                  "editor.action.formatDocument"
                );
                if (action) await action.run();
              } catch {
                // noop
              }
            }, 300);
          }}
          theme={editorTheme}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            lineNumbers: "on",
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}