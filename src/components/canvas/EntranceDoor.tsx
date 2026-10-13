'use client';

import React from 'react';
import * as THREE from 'three';

/**
 * EntranceDoor renders the authentic architectural entrance double door
 * situated on the room's main entrance wall at X = 9.24, Z = 0.0.
 * The Helmet Hanger is prominently mounted directly beside this door.
 */
export function EntranceDoor() {
  return (
    <group name="EntranceDoorFoyer" position={[9.23, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* 1. Heavy Architectural Wood Door Casing / Architrave Frame */}
      <group position={[0, 1.35, 0]}>
        {/* Top Header Beam */}
        <mesh position={[0, 1.32, -0.01]} castShadow receiveShadow>
          <boxGeometry args={[1.56, 0.12, 0.08]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.6} />
        </mesh>
        {/* Left Casing Jamb */}
        <mesh position={[-0.72, 0, -0.01]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 2.52, 0.08]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.6} />
        </mesh>
        {/* Right Casing Jamb */}
        <mesh position={[0.72, 0, -0.01]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 2.52, 0.08]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.6} />
        </mesh>
      </group>

      {/* 2. Vintage Mahogany Double Door Leafs */}
      <group position={[0, 1.25, -0.015]}>
        {/* Left Door Leaf */}
        <group position={[-0.34, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.66, 2.46, 0.045]} />
            <meshStandardMaterial
              color="#3a2215"
              roughness={0.5}
              metalness={0.05}
            />
          </mesh>
          {/* Upper Raised Panel */}
          <mesh position={[0, 0.52, 0.015]} castShadow>
            <boxGeometry args={[0.48, 0.95, 0.01]} />
            <meshStandardMaterial color="#2c180d" roughness={0.55} />
          </mesh>
          {/* Lower Raised Panel */}
          <mesh position={[0, -0.55, 0.015]} castShadow>
            <boxGeometry args={[0.48, 0.85, 0.01]} />
            <meshStandardMaterial color="#2c180d" roughness={0.55} />
          </mesh>
          {/* Satin Brass Lever Handle & Escutcheon */}
          <group position={[0.26, -0.15, 0.025]}>
            <mesh castShadow>
              <boxGeometry args={[0.045, 0.22, 0.008]} />
              <meshStandardMaterial color="#c5a059" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[-0.04, 0.04, 0.025]} rotation={[0, 0, 0.1]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.11, 16]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* Right Door Leaf */}
        <group position={[0.34, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.66, 2.46, 0.045]} />
            <meshStandardMaterial
              color="#3a2215"
              roughness={0.5}
              metalness={0.05}
            />
          </mesh>
          {/* Upper Raised Panel */}
          <mesh position={[0, 0.52, 0.015]} castShadow>
            <boxGeometry args={[0.48, 0.95, 0.01]} />
            <meshStandardMaterial color="#2c180d" roughness={0.55} />
          </mesh>
          {/* Lower Raised Panel */}
          <mesh position={[0, -0.55, 0.015]} castShadow>
            <boxGeometry args={[0.48, 0.85, 0.01]} />
            <meshStandardMaterial color="#2c180d" roughness={0.55} />
          </mesh>
          {/* Satin Brass Lever Handle & Escutcheon */}
          <group position={[-0.26, -0.15, 0.025]}>
            <mesh castShadow>
              <boxGeometry args={[0.045, 0.22, 0.008]} />
              <meshStandardMaterial color="#c5a059" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0.04, 0.04, 0.025]} rotation={[0, 0, -0.1]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.11, 16]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>
      </group>

      {/* 3. Transom Header Window with Warm Geometric Grille */}
      <group position={[0, 2.78, -0.015]}>
        <mesh castShadow>
          <boxGeometry args={[1.40, 0.38, 0.04]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.32, 0.32]} />
          <meshStandardMaterial
            color="#fef9ee"
            roughness={0.8}
            emissive="#fde68a"
            emissiveIntensity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 4. Natural Jute Woven Welcome Mat on Floor */}
      <mesh position={[0, 0.006, 0.55]} receiveShadow>
        <boxGeometry args={[1.15, 0.012, 0.72]} />
        <meshStandardMaterial color="#947a5b" roughness={0.9} />
      </mesh>

      {/* 5. Vintage Entrance Wall Lantern Fixture */}
      <group position={[0, 3.12, 0.12]}>
        {/* Wall Backing Rosette */}
        <mesh position={[0, 0, -0.09]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshStandardMaterial color="#2d1b10" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Curved Gooseneck Arm */}
        <mesh position={[0, 0.04, -0.04]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 16]} />
          <meshStandardMaterial color="#c5a059" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Lantern Cage & Warm Glass */}
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.22, 0.16]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#fef08a"
            emissiveIntensity={0.6}
            roughness={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Soft Warm Foyer Light */}
        <pointLight
          position={[0, -0.05, 0]}
          color="#fed7aa"
          intensity={0.55}
          distance={4.5}
          decay={2}
        />
      </group>
    </group>
  );
}
