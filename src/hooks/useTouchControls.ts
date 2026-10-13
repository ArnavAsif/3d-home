'use client';

import { useRef, useEffect } from 'react';
import { store } from '@/state/useStore';

export interface TouchMovementState {
  moveX: number; // -1 (left) to +1 (right)
  moveZ: number; // -1 (forward) to +1 (backward)
  lookDeltaYaw: number;
  lookDeltaPitch: number;
}

export const touchControlsRef = {
  current: {
    moveX: 0,
    moveZ: 0,
    lookDeltaYaw: 0,
    lookDeltaPitch: 0
  } as TouchMovementState
};

export function useMobileDetection() {
  useEffect(() => {
    const checkMobile = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isNarrow = window.innerWidth <= 768;
      store.setIsMobile(isTouch && isNarrow);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
}
