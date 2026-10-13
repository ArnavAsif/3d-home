'use client';

import React from 'react';
import { useStore, store } from '@/state/useStore';
import { useCart, cartService } from '@/services/cartService';
import {
  Compass,
  ShoppingBag,
  RotateCcw,
  Settings,
  HelpCircle,
  Eye,
  EyeOff,
  MousePointerClick,
  Sparkles
} from 'lucide-react';

export function HUD() {
  const {
    appMode,
    isEntered,
    isPointerLocked,
    settings,
    isMobile,
    isProductPanelOpen
  } = useStore();
  const { totalItems } = useCart();

  if (!isEntered) return null;

  const isExplore = appMode === 'explore';

  const toggleColliders = () => {
    store.updateSettings({ showColliders: !settings.showColliders });
  };

  return (
    <>
      {/* Top HUD Controls Header */}
      <div className="fixed top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none select-none">
        {/* Left: Showroom Title & Featured Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                Helmet Hanger Showroom
                <Sparkles className="w-3 h-3 text-amber-400" />
              </span>
              <span className="text-[10px] text-slate-400">
                Vintage Living Room Showroom • 120 m² Walkable Area
              </span>
            </div>
          </div>

          <button
            onClick={() => store.openProductPanel()}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-semibold backdrop-blur-md transition-all shadow-lg"
          >
            <span>Featured Product [F]</span>
          </button>
        </div>

        {/* Right: Cart, Settings, Reset Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Shopping Cart Drawer Trigger */}
          <button
            onClick={() => cartService.toggleCart()}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 transition-all active:scale-95"
            title="Open Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-slate-950 font-mono font-black text-[10px] shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* Debug Colliders Toggle */}
          <button
            onClick={toggleColliders}
            title={settings.showColliders ? 'Hide Collision Outlines' : 'Show Collision Outlines'}
            className={`p-2 rounded-xl backdrop-blur-md border text-xs font-medium transition-all ${
              settings.showColliders
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {settings.showColliders ? (
              <Eye className="w-4 h-4 text-amber-400" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          {/* Unstuck / Reset Position */}
          <button
            onClick={() => store.triggerResetPosition()}
            title="Reset Player Position (Unstuck)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-800 text-slate-300 text-xs font-medium transition-colors shadow-lg"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Reset Position</span>
          </button>

          {/* Controls Help */}
          <button
            onClick={() => store.setIsHelpOpen(true)}
            title="View Controls & Help"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-800 text-slate-300 transition-colors shadow-lg"
          >
            <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-200" />
          </button>

          {/* Settings */}
          <button
            onClick={() => store.setIsSettingsOpen(true)}
            title="Open Movement & Camera Settings"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-800 text-slate-300 transition-colors shadow-lg"
          >
            <Settings className="w-4 h-4 text-indigo-400 hover:text-indigo-300" />
          </button>
        </div>
      </div>

      {/* Explore Mode Crosshair Reticle */}
      {isExplore && !isProductPanelOpen && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-20">
          <div className="w-1.5 h-1.5 rounded-full bg-white/75 shadow-sm" />
        </div>
      )}

      {/* Pointer Lock Instruction Overlay (when unlocked in Explore mode) */}
      {isExplore && !isPointerLocked && !isMobile && !isProductPanelOpen && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-md border border-sky-500/40 shadow-xl text-slate-200 text-xs font-medium animate-bounce">
            <MousePointerClick className="w-4 h-4 text-sky-400" />
            <span>Click canvas to look around • Press <kbd className="font-mono text-sky-300 font-bold">ESC</kbd> to unlock</span>
          </div>
        </div>
      )}

      {/* Bottom Control Hints */}
      {isExplore && !isMobile && !isProductPanelOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-800/80 text-[11px] text-slate-400">
          <span><kbd className="text-slate-200 font-semibold">W A S D</kbd> Walk</span>
          <span>•</span>
          <span><kbd className="text-slate-200 font-semibold">Shift</kbd> Sprint</span>
          <span>•</span>
          <span><kbd className="text-slate-200 font-semibold">F</kbd> View Helmet Hanger</span>
          <span>•</span>
          <span><kbd className="text-slate-200 font-semibold">ESC</kbd> Release Cursor</span>
        </div>
      )}
    </>
  );
}
