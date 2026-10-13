'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, store } from '@/state/useStore';
import { HELMET_HANGER_PRODUCT } from '@/config/productData';

export function HelmetHangerProduct() {
  const groupRef = useRef<THREE.Group>(null);
  const backplateMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const accentLightRef = useRef<THREE.PointLight>(null);
  const { isHelmetHangerTargeted, selectedVariantId } = useStore();

  const currentVariant = useMemo(() => {
    return (
      HELMET_HANGER_PRODUCT.variants.find(v => v.id === selectedVariantId) ||
      HELMET_HANGER_PRODUCT.variants[0]
    );
  }, [selectedVariantId]);

  // Color mapping based on variant wood finish
  const woodColor = useMemo(() => {
    switch (currentVariant.woodFinish) {
      case 'Dark Walnut':
        return '#4a2e18';
      case 'Vintage Cherry':
        return '#782d1b';
      case 'Carbon Black Oak':
        return '#222326';
      case 'Natural Oak':
      default:
        return '#c8965f';
    }
  }, [currentVariant.woodFinish]);

  // Smooth lerp highlight intensity (0 to 1)
  const highlightIntensity = useRef<number>(0);

  useFrame((_, delta) => {
    const target = isHelmetHangerTargeted ? 1.0 : 0.0;
    highlightIntensity.current = THREE.MathUtils.lerp(
      highlightIntensity.current,
      target,
      Math.min(delta * 8, 1)
    );

    // Elegant, realistic showroom highlight: smoothly boosts warm accent light and subtle wood sheen
    if (accentLightRef.current) {
      accentLightRef.current.intensity = 0.5 + highlightIntensity.current * 1.5;
    }

    if (backplateMatRef.current) {
      backplateMatRef.current.emissive = new THREE.Color('#fef08a');
      backplateMatRef.current.emissiveIntensity = highlightIntensity.current * 0.15;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    store.openProductPanel();
  };

  return (
    <group
      ref={groupRef}
      position={HELMET_HANGER_PRODUCT.roomPosition}
      rotation={HELMET_HANGER_PRODUCT.roomRotation}
      name="FeaturedHelmetHanger"
      onClick={handleClick}
    >
      {/* Architectural Wall Accent Pilaster / Mounting Backing Panel */}
      <mesh position={[0, 0, -0.015]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 2.70, 0.03]} />
        <meshStandardMaterial
          color="#352013"
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* Entryway Shoe Bench / Low Console under the hanger on the hardwood floor */}
      <group position={[0, -1.42, 0.14]}>
        {/* Bench Top Slab */}
        <mesh position={[0, 0.20, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.62, 0.04, 0.34]} />
          <meshStandardMaterial color="#442a17" roughness={0.55} />
        </mesh>
        {/* Bench Legs */}
        {[-0.25, 0.25].map((bx, bi) => (
          <mesh key={bi} position={[bx, 0.09, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.20, 0.30]} />
            <meshStandardMaterial color="#301b0d" roughness={0.7} />
          </mesh>
        ))}
        {/* Turned Wooden Key Tray with Motorcycle Key */}
        <mesh position={[-0.14, 0.23, 0]} castShadow>
          <boxGeometry args={[0.14, 0.018, 0.11]} />
          <meshStandardMaterial color="#2d1b0d" roughness={0.5} />
        </mesh>
        {/* Leather Motorcycle Riding Gloves on bench */}
        <mesh position={[0.13, 0.23, 0.02]} rotation={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.16, 0.026, 0.12]} />
          <meshStandardMaterial color="#1a1816" roughness={0.8} />
        </mesh>
      </group>

      {/* Solid Hardwood Backplate (as shown in product photograph) */}
      <group position={[0, 0, 0.02]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.58, 0.028]} />
          <meshStandardMaterial
            ref={backplateMatRef}
            color={woodColor}
            roughness={0.45}
            metalness={0.05}
          />
        </mesh>

        {/* Bevelled Front Edge Trim */}
        <mesh position={[0, 0, 0.015]} castShadow>
          <boxGeometry args={[0.21, 0.56, 0.005]} />
          <meshStandardMaterial
            color={woodColor}
            roughness={0.4}
            metalness={0.05}
          />
        </mesh>

        {/* Motorcycle Brand Logo Relief Badge (Hayabusa / Suzuki / KTM / Ryker) */}
        <group position={[0, 0.18, 0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 0.07, 0.008]} />
            <meshStandardMaterial color="#2a1c10" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.006]} castShadow>
            <cylinderGeometry args={[0.028, 0.028, 0.006, 16]} />
            <meshStandardMaterial
              color="#eab308"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>

        {/* Cast-Iron Wall Mounting Flange */}
        <group position={[0, -0.16, 0.016]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.012, 16]} />
            <meshStandardMaterial
              color="#1a1a1c"
              roughness={0.65}
              metalness={0.8}
            />
          </mesh>
          {/* 4 Mounting Screws */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
            <mesh
              key={i}
              position={[Math.cos(ang) * 0.03, Math.sin(ang) * 0.03, 0.008]}
              castShadow
            >
              <sphereGeometry args={[0.004, 8, 8]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* Industrial Black Iron Pipe Assembly */}
        <group position={[0, -0.16, 0.025]}>
          {/* Horizontal Pipe Arm */}
          <mesh position={[0, 0, 0.11]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.20, 16]} />
            <meshStandardMaterial
              color="#1a1a1c"
              roughness={0.6}
              metalness={0.85}
            />
          </mesh>

          {/* 90-Degree Iron Pipe Elbow */}
          <mesh position={[0, 0, 0.21]} castShadow>
            <sphereGeometry args={[0.022, 16, 16]} />
            <meshStandardMaterial
              color="#1a1a1c"
              roughness={0.65}
              metalness={0.85}
            />
          </mesh>

          {/* Vertical Pipe Riser */}
          <mesh position={[0, 0.12, 0.21]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.22, 16]} />
            <meshStandardMaterial
              color="#1a1a1c"
              roughness={0.6}
              metalness={0.85}
            />
          </mesh>

          {/* Upper Pipe Flange under Rest Pad */}
          <mesh position={[0, 0.23, 0.21]} rotation={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.01, 16]} />
            <meshStandardMaterial
              color="#1a1a1c"
              roughness={0.65}
              metalness={0.85}
            />
          </mesh>

          {/* Turned Round Hardwood Helmet Rest Pad */}
          <mesh position={[0, 0.25, 0.21]} castShadow receiveShadow>
            <cylinderGeometry args={[0.075, 0.072, 0.03, 24]} />
            <meshStandardMaterial
              color={woodColor}
              roughness={0.45}
              metalness={0.05}
            />
          </mesh>

          {/* Sleek Aerodynamic Motorcycle Helmet displayed on the hanger */}
          <group position={[0, 0.38, 0.21]}>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.13, 24, 24]} />
              <meshStandardMaterial
                color="#0f172a"
                roughness={0.15}
                metalness={0.7}
              />
            </mesh>
            <mesh position={[0, 0.02, 0.05]} rotation={[0.15, 0, 0]} castShadow>
              <cylinderGeometry
                args={[0.128, 0.128, 0.07, 24, 1, false, 0, Math.PI * 0.9]}
              />
              <meshStandardMaterial
                color="#0284c7"
                roughness={0.1}
                metalness={0.9}
                transparent
                opacity={0.85}
              />
            </mesh>
            <mesh position={[0, 0.06, 0]} castShadow>
              <boxGeometry args={[0.018, 0.14, 0.24]} />
              <meshStandardMaterial
                color="#f97316"
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
          </group>
        </group>
      </group>

      {/* Gentle, Premium Focused Accent Light that illuminates the product when targeted */}
      <pointLight
        ref={accentLightRef}
        position={[0, 0.2, 0.45]}
        color="#fffbeb"
        intensity={0.5}
        distance={2.8}
        decay={2}
      />
    </group>
  );
}
