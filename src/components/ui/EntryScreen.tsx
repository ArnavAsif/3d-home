'use client';

import React from 'react';
import { useStore, store } from '@/state/useStore';
import { Play, Sparkles, ShieldCheck, ShoppingBag, Compass, Eye } from 'lucide-react';

export function EntryScreen() {
  const { isEntered, isLoading } = useStore();

  if (isEntered) return null;

  const handleEnter = () => {
    store.setIsEntered(true);
    store.setAppMode('explore');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 select-none">
      <div className="relative max-w-xl w-full p-8 md:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden text-center flex flex-col items-center">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Interactive 3D Showroom Experience</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          Motorcycle Helmet Hanger Showroom
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-md mb-8">
          Explore an expansive, brightly illuminated 3D room in first-person view. Approach the featured Handcrafted Helmet Hanger directly in front of the door, inspect it under its spotlight, and press <strong className="text-sky-300">F</strong> to view details and order.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-8 text-left">
          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
            <Compass className="w-5 h-5 text-sky-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Spacious Room</div>
              <div className="text-[11px] text-slate-400">Expansive 120 m² walkable living room</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
            <Eye className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Featured Product</div>
              <div className="text-[11px] text-slate-400">Positioned by door with spotlight</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Solid Collisions</div>
              <div className="text-[11px] text-slate-400">No clipping through walls or items</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
            <ShoppingBag className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Press F to Buy</div>
              <div className="text-[11px] text-slate-400">Interactive panel & live cart</div>
            </div>
          </div>
        </div>

        {/* Enter Button */}
        <button
          onClick={handleEnter}
          disabled={isLoading}
          className={`w-full max-w-md py-4 px-8 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-xl ${
            isLoading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{isLoading ? 'Loading 3D Showroom...' : 'Enter 3D Showroom'}</span>
        </button>

        <p className="text-xs text-slate-500 mt-4">
          Click inside to lock mouse • Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">ESC</kbd> to unlock cursor
        </p>
      </div>
    </div>
  );
}
