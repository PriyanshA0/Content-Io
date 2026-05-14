/**
 * Window Frame Renderer for Code Mode
 * Renders different window frame styles: macOS, Windows11, GNOME, Terminal, Minimal
 */

import React from 'react';
import { WindowFrameType } from '@/app/types/styling';
import { ShieldCheck } from 'lucide-react';

interface WindowFrameRendererProps {
  type: WindowFrameType;
  titleText: string;
  showButtons: boolean;
  children: React.ReactNode;
}

export function WindowFrameRenderer({
  type,
  titleText,
  showButtons,
  children,
}: WindowFrameRendererProps) {
  if (type === 'minimal') {
    return <>{children}</>;
  }

  if (type === 'terminal') {
    return (
      <div className="flex flex-col bg-black text-green-400" style={{ fontFamily: '"Courier New", monospace' }}>
        <div className="px-4 py-2 border-b border-green-400/30">
          <span className="text-[10px] font-semibold">{titleText || '$ terminal'}</span>
        </div>
        <div className="overflow-auto">{children}</div>
      </div>
    );
  }

  if (type === 'windows11') {
    return (
      <div className="flex flex-col bg-slate-900">
        <div className="flex items-center justify-between bg-blue-600 px-4 py-2.5">
          <span className="text-[10px] font-medium text-white">{titleText}</span>
          <div className="flex gap-1">
            <span className="h-6 w-6 flex items-center justify-center text-white hover:bg-slate-700 text-xs cursor-pointer">−</span>
            <span className="h-6 w-6 flex items-center justify-center text-white hover:bg-slate-700 text-xs cursor-pointer">□</span>
            <span className="h-6 w-6 flex items-center justify-center text-white hover:bg-slate-700 text-xs cursor-pointer">✕</span>
          </div>
        </div>
        <div className="border border-slate-700 border-t-0">{children}</div>
      </div>
    );
  }

  if (type === 'gnome') {
    return (
      <div className="flex flex-col bg-slate-900">
        <div className="flex items-center justify-between bg-slate-950 px-4 py-2">
          <span className="text-[10px] font-medium text-slate-200">{titleText}</span>
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-slate-600 hover:bg-slate-500 cursor-pointer" />
            <span className="h-2 w-2 rounded-full bg-slate-600 hover:bg-slate-500 cursor-pointer" />
            <span className="h-2 w-2 rounded-full bg-slate-600 hover:bg-slate-500 cursor-pointer" />
          </div>
        </div>
        <div className="border border-slate-700 border-t-0">{children}</div>
      </div>
    );
  }

  // macOS (default)
  return (
    <div className="flex flex-col bg-slate-900">
      <div className="flex items-center justify-between bg-slate-800 px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          {showButtons && (
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 hover:bg-rose-500 cursor-pointer" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 hover:bg-amber-500 cursor-pointer" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 cursor-pointer" />
            </div>
          )}
          <span className="text-[10px] font-medium opacity-50 text-slate-200">{titleText}</span>
        </div>
        <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 opacity-60" />
      </div>
      <div className="border border-white/10 border-t-0">{children}</div>
    </div>
  );
}
