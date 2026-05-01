"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading editor...</div>,
});

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  language: "javascript" | "typescript" | "python" | "bash" | "java" | "cpp";
  onLanguageChange: (language: "javascript" | "typescript" | "python" | "bash" | "java" | "cpp") => void;
}

const languages = ["javascript", "typescript", "python", "bash", "java", "cpp"] as const;

export function CodeEditor({ code, onCodeChange, language, onLanguageChange }: CodeEditorProps) {
  const [editorTheme, setEditorTheme] = useState<"vs" | "vs-dark">("vs");

  useEffect(() => {
    const syncTheme = () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "vs-dark" : "vs";
      setEditorTheme(nextTheme);
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-white">Paste code</div>
          <div className="text-xs text-slate-400">Syntax-highlighted editing with live preview.</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {languages.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onLanguageChange(item)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${language === item ? "bg-white text-slate-950" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[380px]">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => onCodeChange(value ?? "")}
          theme={editorTheme}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            padding: { top: 18, bottom: 18 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            lineNumbers: "on",
          }}
        />
      </div>
    </div>
  );
}
