'use client';

import React from 'react';
import { useStore, store } from '@/state/useStore';
import { Eye, Sparkles } from 'lucide-react';

export function InteractionPrompt() {
  const { isHelmetHangerTargeted, isProductPanelOpen, isEntered } = useStore();

  if (!isEntered || !isHelmetHangerTargeted || isProductPanelOpen) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.openProductPanel();
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none animate-in fade-in zoom-in-95 duration-200">
      <button
        onClick={handleClick}
        className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white border border-sky-500/60 shadow-2xl shadow-sky-500/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
      >
        <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-mono font-bold text-xs shadow-inner">
          F
        </div>

        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold tracking-wide text-slate-100">
            View Helmet Hanger
          </span>
        </div>

        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      </button>
    </div>
  );
}
