'use client';

import React, { useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { useStore, store } from '@/state/useStore';
import { Loader2, AlertCircle, Compass } from 'lucide-react';

export function LoadingScreen() {
  const { isLoading: storeLoading, loadingError } = useStore();
  const { active, progress, errors } = useProgress();

  const isModelLoading = active || progress < 100;
  const isLoading = storeLoading || isModelLoading;

  useEffect(() => {
    if (!isModelLoading) {
      store.setLoading(false, 100, null);
    } else {
      store.setLoading(true, Math.round(progress), null);
    }
  }, [isModelLoading, progress]);

  useEffect(() => {
    if (errors && errors.length > 0) {
      store.setLoading(false, 0, `Error loading assets: ${errors[0]}`);
    }
  }, [errors]);

  if (!isLoading && !loadingError) return null;

  const displayProgress = Math.min(100, Math.round(progress));

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md text-white select-none">
      <div className="max-w-md w-full mx-4 p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-6 text-indigo-400">
          {loadingError ? (
            <AlertCircle className="w-8 h-8 text-rose-400" />
          ) : (
            <Compass className="w-8 h-8 animate-pulse text-indigo-400" />
          )}
        </div>

        <h2 className="text-xl font-bold tracking-tight mb-2">
          {loadingError ? 'Asset Loading Error' : 'Loading 3D Environment'}
        </h2>

        <p className="text-sm text-slate-400 mb-6">
          {loadingError
            ? loadingError
            : 'Unpacking stylized room geometry, tatami textures, and collision boundaries...'}
        </p>

        {!loadingError ? (
          <div className="w-full space-y-3">
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.max(5, displayProgress)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                Processing GLB model
              </span>
              <span className="font-mono text-sky-300 font-medium">
                {displayProgress}%
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/25"
          >
            Retry Loading
          </button>
        )}
      </div>
    </div>
  );
}
