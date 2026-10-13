'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomModel } from './RoomModel';
import { EntranceDoor } from './EntranceDoor';
import { FirstPersonController } from './FirstPersonController';
import { FurnitureManager } from './FurnitureManager';
import { EditModeControls } from './EditModeControls';
import { RoomBoundarySystem } from './RoomBoundarySystem';
import { HelmetHangerProduct } from './HelmetHangerProduct';
import { HelmetHangerSpotlight } from './HelmetHangerSpotlight';
import { ProductTargeting } from './ProductTargeting';
import { useStore, store } from '@/state/useStore';
import { usePointerLock } from '@/hooks/usePointerLock';
import { DEFAULT_SPAWN_POSITION } from '@/utils/roomBounds';

function ShowroomLighting() {
  return (
    <>
      {/* High-quality bright ambient illumination */}
      <ambientLight color="#fffdf7" intensity={1.25} />

      {/* Balanced hemisphere light: pure sky + warm hardwood floor bounce */}
      <hemisphereLight
        color="#ffffff"
        groundColor="#dfcca9"
        intensity={1.1}
      />

      {/* Main natural daylight streaming through the French windows */}
      <directionalLight
        position={[0, 6, -7]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-5}
        shadow-camera-right={10}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0004}
      />

      {/* Warm ambient chandelier / ceiling fill over the seating lounge */}
      <pointLight
        position={[0, 3.2, 0]}
        intensity={0.65}
        color="#fed7aa"
        distance={9}
        decay={2}
      />

      {/* Warm ambient ceiling fill for the spacious East hall */}
      <pointLight
        position={[5.5, 3.2, 0.5]}
        intensity={0.55}
        color="#fef3c7"
        distance={9}
        decay={2}
      />

      {/* Soft warm fill near the reading lamps and plants */}
      <pointLight
        position={[-1.8, 2.5, 3.8]}
        intensity={0.4}
        color="#fed7aa"
        distance={6}
        decay={2}
      />
    </>
  );
}

export function RoomScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { appMode, isEntered, isPointerLocked, isMobile, isProductPanelOpen } = useStore();
  const { requestLock } = usePointerLock(containerRef);

  const handleContainerClick = () => {
    if (appMode === 'explore' && isEntered && !isPointerLocked && !isMobile && !isProductPanelOpen) {
      requestLock();
    }
  };

  const handlePointerMissed = () => {
    if (appMode === 'edit') {
      store.selectFurniture(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-slate-900 select-none cursor-crosshair"
      onClick={handleContainerClick}
    >
      <Canvas
        shadows
        camera={{
          fov: 75,
          near: 0.05,
          far: 50,
          position: DEFAULT_SPAWN_POSITION
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
          powerPreference: 'high-performance'
        }}
        onPointerMissed={handlePointerMissed}
      >
        {/* Soft daylight sky visible through the windows */}
        <color attach="background" args={['#e0f2fe']} />
        <fog attach="fog" args={['#e0f2fe', 15, 45]} />

        {/* Bright General Room Illumination */}
        <ShowroomLighting />

        {/* Dedicated Product Spotlight (Exclusively illuminates the Helmet Hanger) */}
        <HelmetHangerSpotlight />

        <Suspense fallback={null}>
          {/* Main 3D Room Visual Environment */}
          <RoomModel />

          {/* Architectural Entrance Double Door on the East Wall */}
          <EntranceDoor />

          {/* Featured Helmet Hanger Display beside the entrance door */}
          <HelmetHangerProduct />

          <FurnitureManager />
          <RoomBoundarySystem />
        </Suspense>

        <FirstPersonController />
        <ProductTargeting />
        <EditModeControls />
      </Canvas>
    </div>
  );
}
