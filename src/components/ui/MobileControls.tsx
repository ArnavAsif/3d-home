'use client';

import React, { useRef, useState } from 'react';
import { useStore, store } from '@/state/useStore';
import { touchControlsRef } from '@/hooks/useTouchControls';
import { RotateCcw, Zap } from 'lucide-react';

export function MobileControls() {
  const { isMobile, appMode, isEntered } = useStore();
  const [isSprinting, setIsSprinting] = useState(false);
  const joystickTouchId = useRef<number | null>(null);
  const lookTouchId = useRef<number | null>(null);
  const lookLastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [stickOffset, setStickOffset] = useState({ x: 0, y: 0 });

  if (!isMobile || !isEntered || appMode !== 'explore') return null;

  // Joystick touch handlers
  const handleJoystickStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (joystickTouchId.current !== null) return;
    const touch = e.changedTouches[0];
    joystickTouchId.current = touch.identifier;
    updateJoystick(touch.clientX, touch.clientY, e.currentTarget);
  };

  const handleJoystickMove = (e: React.TouchEvent<HTMLDivElement>) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchId.current) {
        updateJoystick(touch.clientX, touch.clientY, e.currentTarget);
        break;
      }
    }
  };

  const handleJoystickEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickTouchId.current) {
        joystickTouchId.current = null;
        setStickOffset({ x: 0, y: 0 });
        touchControlsRef.current.moveX = 0;
        touchControlsRef.current.moveZ = 0;
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = rect.width / 2 - 15;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setStickOffset({ x: dx, y: dy });
    // Normalize to [-1, 1]
    const mult = isSprinting ? 1.5 : 1.0;
    touchControlsRef.current.moveX = (dx / maxRadius) * mult;
    touchControlsRef.current.moveZ = (dy / maxRadius) * mult;
  };

  // Look pad touch handlers
  const handleLookStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (lookTouchId.current !== null) return;
    const touch = e.changedTouches[0];
    lookTouchId.current = touch.identifier;
    lookLastPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLookMove = (e: React.TouchEvent<HTMLDivElement>) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === lookTouchId.current) {
        const dx = touch.clientX - lookLastPos.current.x;
        const dy = touch.clientY - lookLastPos.current.y;
        lookLastPos.current = { x: touch.clientX, y: touch.clientY };

        touchControlsRef.current.lookDeltaYaw += dx;
        touchControlsRef.current.lookDeltaPitch += dy;
        break;
      }
    }
  };

  const handleLookEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchId.current) {
        lookTouchId.current = null;
        break;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none select-none">
      {/* Left Virtual Joystick */}
      <div
        className="absolute bottom-8 left-6 w-32 h-32 rounded-full bg-slate-900/40 border border-slate-700/60 backdrop-blur-sm pointer-events-auto flex items-center justify-center touch-none"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
      >
        <div
          className="w-12 h-12 rounded-full bg-indigo-500/80 border border-white/40 shadow-lg pointer-events-none"
          style={{
            transform: `translate(${stickOffset.x}px, ${stickOffset.y}px)`
          }}
        />
      </div>

      {/* Right Look Area */}
      <div
        className="absolute top-24 bottom-8 right-0 left-48 pointer-events-auto touch-none"
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        onTouchCancel={handleLookEnd}
      />

      {/* Floating Action Buttons */}
      <div className="absolute bottom-8 right-6 flex flex-col gap-3 pointer-events-auto">
        <button
          onClick={() => setIsSprinting(!isSprinting)}
          className={`p-3 rounded-full border shadow-xl backdrop-blur-md transition-colors ${
            isSprinting
              ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold'
              : 'bg-slate-900/70 border-slate-700 text-slate-300'
          }`}
        >
          <Zap className="w-5 h-5" />
        </button>

        <button
          onClick={() => store.triggerResetPosition()}
          className="p-3 rounded-full bg-slate-900/70 border border-slate-700 text-slate-300 shadow-xl backdrop-blur-md"
        >
          <RotateCcw className="w-5 h-5 text-sky-400" />
        </button>
      </div>
    </div>
  );
}
