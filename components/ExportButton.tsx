"use client";

import { Download, LoaderCircle } from "lucide-react";

interface ExportButtonProps {
  onExport: () => void;
  isExporting: boolean;
  hdExport: boolean;
}

export function ExportButton({ onExport, isExporting, hdExport }: ExportButtonProps) {
  return (
    <button
      type="button"
      onClick={onExport}
      disabled={isExporting}
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(168,85,247,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isExporting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {isExporting ? "Preparing export" : hdExport ? "Download Image (HD)" : "Download Image"}
    </button>
  );
}
