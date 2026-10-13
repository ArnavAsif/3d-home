'use client';

import React from 'react';
import { useStore, store, INITIAL_SETTINGS } from '@/state/useStore';
import { X, Sliders, RotateCcw } from 'lucide-react';

export function SettingsModal() {
  const { isSettingsOpen, settings } = useStore();

  if (!isSettingsOpen) return null;

  const handleUpdate = (key: keyof typeof settings, value: any) => {
    store.updateSettings({ [key]: value });
  };

  const handleReset = () => {
    store.updateSettings(INITIAL_SETTINGS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 select-none">
      <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Experience Settings</h2>
              <p className="text-xs text-slate-400">Customize locomotion and camera preferences</p>
            </div>
          </div>

          <button
            onClick={() => store.setIsSettingsOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders Container */}
        <div className="space-y-4 py-4">
          {/* Movement Speed */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
              <span>Walking Speed</span>
              <span className="font-mono text-indigo-400">{settings.moveSpeed.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.5"
              step="0.1"
              value={settings.moveSpeed}
              onChange={(e) => handleUpdate('moveSpeed', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Mouse Sensitivity */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
              <span>Mouse Look Sensitivity</span>
              <span className="font-mono text-indigo-400">
                {(settings.mouseSensitivity * 1000).toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0.0008"
              max="0.005"
              step="0.0002"
              value={settings.mouseSensitivity}
              onChange={(e) => handleUpdate('mouseSensitivity', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Eye Height */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
              <span>Camera Eye Height</span>
              <span className="font-mono text-indigo-400">{settings.eyeHeight.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="1.1"
              max="1.85"
              step="0.05"
              value={settings.eyeHeight}
              onChange={(e) => handleUpdate('eyeHeight', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Player Collision Radius */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
              <span>Player Collision Radius</span>
              <span className="font-mono text-indigo-400">{settings.playerRadius.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="0.18"
              max="0.45"
              step="0.02"
              value={settings.playerRadius}
              onChange={(e) => handleUpdate('playerRadius', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Head Bobbing Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-xs font-semibold text-slate-200">Head Bobbing</div>
              <div className="text-[11px] text-slate-400">Subtle camera oscillation while walking</div>
            </div>
            <button
              onClick={() => handleUpdate('headBobbing', !settings.headBobbing)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.headBobbing ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.headBobbing ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Show Colliders Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-xs font-semibold text-slate-200">Show Collision Boxes</div>
              <div className="text-[11px] text-slate-400">Display room boundary and obstacle wireframes</div>
            </div>
            <button
              onClick={() => handleUpdate('showColliders', !settings.showColliders)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.showColliders ? 'bg-amber-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.showColliders ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => store.setIsSettingsOpen(false)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
