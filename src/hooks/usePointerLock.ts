'use client';

import { useEffect, useCallback } from 'react';
import { store, useStore } from '@/state/useStore';

export function usePointerLock(targetElementRef: React.RefObject<HTMLElement | null>) {
  const { isPointerLocked, appMode, isEntered } = useStore();

  const requestLock = useCallback(() => {
    if (appMode !== 'explore' || !isEntered) return;
    const element = targetElementRef.current || document.body;
    if (document.pointerLockElement !== element) {
      try {
        const promise = element.requestPointerLock?.();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(() => {
            // Browser denied pointer lock without user gesture
          });
        }
      } catch {
        // Fallback or older browser
      }
    }
  }, [appMode, isEntered, targetElementRef]);

  const exitLock = useCallback(() => {
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }
  }, []);

  useEffect(() => {
    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === targetElementRef.current ||
                     (targetElementRef.current === null && !!document.pointerLockElement);
      store.setIsPointerLocked(locked);
    };

    const handlePointerLockError = () => {
      store.setIsPointerLocked(false);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', handlePointerLockError);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('pointerlockerror', handlePointerLockError);
    };
  }, [targetElementRef]);

  // When switching from explore to edit, release pointer lock
  useEffect(() => {
    if (appMode === 'edit' && document.pointerLockElement) {
      document.exitPointerLock?.();
    }
  }, [appMode]);

  return { isPointerLocked, requestLock, exitLock };
}
