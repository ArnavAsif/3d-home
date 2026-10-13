'use client';

import React from 'react';
import { useStore, store } from '@/state/useStore';
import { X, BookOpen, Compass, Shield, ShoppingBag, Sparkles } from 'lucide-react';

export function InstructionsOverlay() {
  const { isHelpOpen } = useStore();

  if (!isHelpOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 select-none">
      <div className="max-w-xl w-full p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Showroom Guide & Controls</h2>
              <p className="text-xs text-slate-400">How to navigate, inspect, and purchase</p>
            </div>
          </div>

          <button
            onClick={() => store.setIsHelpOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 py-6 text-xs text-slate-300">
          {/* Featured Helmet Hanger Interaction */}
          <div className="flex gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1.5">
                Featured Product: Helmet Hanger
              </h4>
              <p className="text-slate-400 leading-relaxed mb-1.5">
                The Handcrafted Hardwood & Iron Pipe Helmet Hanger is positioned directly in front of the room entrance door, highlighted by a dedicated product spotlight.
              </p>
              <ul className="space-y-1 text-slate-400">
                <li>• Approach the Helmet Hanger within 3 meters and look directly at it to target it.</li>
                <li>• When targeted, a gentle highlight illuminates and a prompt appears: <strong className="text-sky-300">Press F to View Helmet Hanger</strong>.</li>
                <li>• Pressing <strong className="text-sky-300">F</strong> opens the product details panel with image gallery, wood finishes, emblems, and Add to Cart.</li>
              </ul>
            </div>
          </div>

          {/* Locomotion */}
          <div className="flex gap-3">
            <Compass className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1.5">First-Person Navigation</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>• <strong className="text-slate-200">W / A / S / D</strong> or <strong className="text-slate-200">Arrow Keys</strong>: Walk freely across the expanded 61 m² tatami room.</li>
                <li>• <strong className="text-slate-200">Mouse Movement</strong>: Smooth 360° mouse look with realistic human eye height.</li>
                <li>• <strong className="text-slate-200">Shift</strong>: Sprint across the showroom.</li>
                <li>• <strong className="text-slate-200">ESC</strong>: Release mouse pointer lock or close panels.</li>
              </ul>
            </div>
          </div>

          {/* Collisions & Room Bounds */}
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1.5">Expanded Room & Collision Boundaries</h4>
              <p className="text-slate-400 leading-relaxed mb-2">
                The room has been expanded by 1.45x (over 2x usable interior space) with plenty of room to walk around the bed, closets, and central table.
              </p>
              <p className="text-slate-400">
                • Wall sliding physics prevent clipping through the walls, doors, or furniture while keeping movement fluid.
              </p>
            </div>
          </div>

          {/* Shopping Cart */}
          <div className="flex gap-3">
            <ShoppingBag className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1.5">Showroom Shopping Cart</h4>
              <p className="text-slate-400 leading-relaxed">
                Add variants to your cart, customize quantity, review items in the slide-out Cart Drawer, and proceed through the checkout flow.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => store.setIsHelpOpen(false)}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
