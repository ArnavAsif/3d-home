'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, store } from '@/state/useStore';
import { useKeyboard } from '@/hooks/useKeyboard';
import { touchControlsRef } from '@/hooks/useTouchControls';
import { moveWithCollision, computeFurnitureAABB } from '@/utils/collision';
import {
  ROOM_BOUNDS,
  STATIC_ROOM_COLLIDERS,
  DEFAULT_SPAWN_POSITION,
  DEFAULT_SPAWN_ROTATION
} from '@/utils/roomBounds';

export function FirstPersonController() {
  const { camera } = useThree();
  const {
    appMode,
    isEntered,
    isPointerLocked,
    settings,
    resetTrigger,
    furnitureList,
    isMobile,
    isProductPanelOpen
  } = useStore();

  // Exploration movement active only when in explore mode, entered, and product panel is closed
  const canMove = appMode === 'explore' && isEntered && !isProductPanelOpen;
  const keysRef = useKeyboard(canMove);

  const posRef = useRef<THREE.Vector3>(
    new THREE.Vector3(...DEFAULT_SPAWN_POSITION)
  );
  const yawRef = useRef<number>(DEFAULT_SPAWN_ROTATION[1]);
  const pitchRef = useRef<number>(DEFAULT_SPAWN_ROTATION[0]);
  const velocityRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const walkCycleRef = useRef<number>(0);
  const lastResetRef = useRef<number>(resetTrigger);

  // Synchronize reset trigger
  useEffect(() => {
    if (resetTrigger !== lastResetRef.current) {
      lastResetRef.current = resetTrigger;
      posRef.current.set(...DEFAULT_SPAWN_POSITION);
      yawRef.current = DEFAULT_SPAWN_ROTATION[1];
      pitchRef.current = DEFAULT_SPAWN_ROTATION[0];
      velocityRef.current.set(0, 0, 0);
      walkCycleRef.current = 0;
      store.setPlayerPosition([...DEFAULT_SPAWN_POSITION]);
    }
  }, [resetTrigger]);

  // Pointer lock mouse movement listener
  useEffect(() => {
    if (!canMove) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked && !isMobile) return;

      const sensitivity = settings.mouseSensitivity;
      yawRef.current -= e.movementX * sensitivity;
      pitchRef.current -= e.movementY * sensitivity;

      // Strict vertical clamping (-80 deg to +80 deg)
      const maxPitch = Math.PI * 0.44;
      pitchRef.current = Math.max(-maxPitch, Math.min(maxPitch, pitchRef.current));
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canMove, isPointerLocked, isMobile, settings.mouseSensitivity]);

  // Main per-frame movement and collision resolution loop
  useFrame((_, delta) => {
    if (!isEntered) return;

    // When product panel is open, zero out velocity and halt movement
    if (isProductPanelOpen) {
      velocityRef.current.set(0, 0, 0);
      return;
    }

    if (appMode !== 'explore') return;

    const dt = Math.min(delta, 0.05);

    // Mobile touch look handling
    if (isMobile) {
      const touchState = touchControlsRef.current;
      if (touchState.lookDeltaYaw !== 0 || touchState.lookDeltaPitch !== 0) {
        yawRef.current -= touchState.lookDeltaYaw * settings.mouseSensitivity * 1.5;
        pitchRef.current -= touchState.lookDeltaPitch * settings.mouseSensitivity * 1.5;
        const maxPitch = Math.PI * 0.44;
        pitchRef.current = Math.max(-maxPitch, Math.min(maxPitch, pitchRef.current));
        touchState.lookDeltaYaw = 0;
        touchState.lookDeltaPitch = 0;
      }
    }

    const keys = keysRef.current;
    const touch = touchControlsRef.current;

    let moveForward = 0;
    let moveRight = 0;

    if (keys.forward) moveForward += 1;
    if (keys.backward) moveForward -= 1;
    if (keys.right) moveRight += 1;
    if (keys.left) moveRight -= 1;

    if (isMobile) {
      moveRight += touch.moveX;
      moveForward += -touch.moveZ;
    }

    const inputLength = Math.hypot(moveForward, moveRight);
    if (inputLength > 1) {
      moveForward /= inputLength;
      moveRight /= inputLength;
    }

    const isSprinting = keys.sprint;
    const currentMaxSpeed = isSprinting ? settings.runSpeed : settings.moveSpeed;

    const sinYaw = Math.sin(yawRef.current);
    const cosYaw = Math.cos(yawRef.current);

    const targetVx = (moveRight * cosYaw - moveForward * sinYaw) * currentMaxSpeed;
    const targetVz = (-moveRight * sinYaw - moveForward * cosYaw) * currentMaxSpeed;

    const accelRate = inputLength > 0.01 ? 14 : 18;
    velocityRef.current.x = THREE.MathUtils.lerp(velocityRef.current.x, targetVx, dt * accelRate);
    velocityRef.current.z = THREE.MathUtils.lerp(velocityRef.current.z, targetVz, dt * accelRate);

    const deltaMove: [number, number, number] = [
      velocityRef.current.x * dt,
      0,
      velocityRef.current.z * dt
    ];

    const allColliders = [
      ...STATIC_ROOM_COLLIDERS,
      ...furnitureList.map(f =>
        computeFurnitureAABB(f.id, f.name, f.position, f.scale, f.colliderSize)
      )
    ];

    const currentPosition: [number, number, number] = [
      posRef.current.x,
      posRef.current.y,
      posRef.current.z
    ];

    const resolvedPos = moveWithCollision(
      currentPosition,
      deltaMove,
      settings.playerRadius,
      ROOM_BOUNDS,
      allColliders
    );

    posRef.current.x = resolvedPos[0];
    posRef.current.z = resolvedPos[2];

    const actualHorizontalSpeed = Math.hypot(velocityRef.current.x, velocityRef.current.z);
    let bobbingOffset = 0;
    if (settings.headBobbing && actualHorizontalSpeed > 0.2) {
      walkCycleRef.current += dt * actualHorizontalSpeed * 4.5;
      bobbingOffset = Math.sin(walkCycleRef.current) * 0.015;
    }

    posRef.current.y = ROOM_BOUNDS.floorY + settings.eyeHeight + bobbingOffset;

    camera.position.copy(posRef.current);

    const euler = new THREE.Euler(pitchRef.current, yawRef.current, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);

    store.setPlayerPosition([posRef.current.x, posRef.current.y, posRef.current.z]);
  });

  return null;
}
