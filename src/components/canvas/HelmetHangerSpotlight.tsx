'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { HELMET_HANGER_PRODUCT } from '@/config/productData';

export function HelmetHangerSpotlight() {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  const [px, py, pz] = HELMET_HANGER_PRODUCT.roomPosition;

  useEffect(() => {
    if (spotLightRef.current && targetRef.current) {
      spotLightRef.current.target = targetRef.current;
    }
  }, []);

  return (
    <group name="HelmetHangerDedicatedLighting">
      {/* Target object positioned at the wall-mounted helmet hanger */}
      <object3D
        ref={targetRef}
        position={[px - 0.1, py, pz]}
      />

      {/* Soft, focused product spotlight from ceiling beam aimed specifically at the Helmet Hanger */}
      <spotLight
        ref={spotLightRef}
        position={[px - 1.6, 3.85, pz]}
        color="#fffaf0"
        intensity={3.6}
        angle={Math.PI / 4.8}
        penumbra={0.65}
        distance={6.0}
        decay={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />

      {/* Subtle warm accent point light directly near the wood and cast iron to reveal grain */}
      <pointLight
        position={[px - 0.45, py + 0.1, pz]}
        color="#fef3c7"
        intensity={0.75}
        distance={2.2}
        decay={2}
      />
    </group>
  );
}
