'use client';

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { PlacedFurniture } from '@/types';
import { useStore, store } from '@/state/useStore';

interface FurnitureItemProps {
  item: PlacedFurniture;
}

function CustomExternalModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone(true)} />;
}

export function FurnitureItem({ item }: FurnitureItemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { appMode, selectedFurnitureId } = useStore();
  const isSelected = selectedFurnitureId === item.id;
  const isEditMode = appMode === 'edit';

  const handleClick = (e: any) => {
    if (isEditMode) {
      e.stopPropagation();
      store.selectFurniture(item.id);
    }
  };

  const renderMesh = () => {
    if (item.modelUrl) {
      return <CustomExternalModel url={item.modelUrl} />;
    }

    switch (item.templateType) {
      case 'shoji_lantern':
        return (
          <group>
            {/* Wooden Base */}
            <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.3, 0.08, 0.3]} />
              <meshStandardMaterial color="#451a03" roughness={0.7} />
            </mesh>
            {/* Paper Lantern Body */}
            <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.24, 0.48, 0.24]} />
              <meshStandardMaterial
                color={item.color}
                emissive={item.color}
                emissiveIntensity={0.65}
                roughness={0.9}
              />
            </mesh>
            {/* Wooden Corner Pillars */}
            {[-0.12, 0.12].map((x, xi) =>
              [-0.12, 0.12].map((z, zi) => (
                <mesh key={`${xi}-${zi}`} position={[x, 0.32, z]} castShadow>
                  <boxGeometry args={[0.02, 0.48, 0.02]} />
                  <meshStandardMaterial color="#451a03" roughness={0.7} />
                </mesh>
              ))
            )}
            {/* Wooden Roof/Cap */}
            <mesh position={[0, 0.58, 0]} castShadow>
              <boxGeometry args={[0.28, 0.04, 0.28]} />
              <meshStandardMaterial color="#451a03" roughness={0.7} />
            </mesh>
            {/* Warm Lantern Light */}
            <pointLight
              color={item.color}
              intensity={0.8}
              distance={2.5}
              decay={2}
              position={[0, 0.35, 0]}
            />
          </group>
        );

      case 'floor_cushion':
        return (
          <group>
            <mesh position={[0, 0.075, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.14, 0.5]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.85}
                metalness={0.05}
              />
            </mesh>
            {/* Center Indentation Button */}
            <mesh position={[0, 0.145, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.015, 12]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
          </group>
        );

      case 'wooden_stool':
        return (
          <group>
            {/* Seat Top */}
            <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.05, 24]} />
              <meshStandardMaterial color={item.color} roughness={0.6} />
            </mesh>
            {/* Legs */}
            {[
              [0.1, 0.21, 0.1],
              [-0.1, 0.21, 0.1],
              [0.1, 0.21, -0.1],
              [-0.1, 0.21, -0.1]
            ].map(([lx, ly, lz], i) => (
              <mesh key={i} position={[lx, ly, lz]} castShadow receiveShadow>
                <cylinderGeometry args={[0.018, 0.015, 0.4, 12]} />
                <meshStandardMaterial color={item.color} roughness={0.7} />
              </mesh>
            ))}
          </group>
        );

      case 'low_table':
        return (
          <group>
            {/* Table Surface */}
            <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.85, 0.04, 0.5]} />
              <meshStandardMaterial color={item.color} roughness={0.5} />
            </mesh>
            {/* Table Legs */}
            {[
              [0.36, 0.15, 0.2],
              [-0.36, 0.15, 0.2],
              [0.36, 0.15, -0.2],
              [-0.36, 0.15, -0.2]
            ].map(([lx, ly, lz], i) => (
              <mesh key={i} position={[lx, ly, lz]} castShadow receiveShadow>
                <boxGeometry args={[0.05, 0.3, 0.05]} />
                <meshStandardMaterial color={item.color} roughness={0.7} />
              </mesh>
            ))}
          </group>
        );

      case 'bonsai_plant':
        return (
          <group>
            {/* Ceramic Pot */}
            <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.14, 0.11, 0.14, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} />
            </mesh>
            {/* Soil */}
            <mesh position={[0, 0.15, 0]} receiveShadow>
              <cylinderGeometry args={[0.13, 0.13, 0.01, 16]} />
              <meshStandardMaterial color="#2d1e17" roughness={0.9} />
            </mesh>
            {/* Trunk */}
            <mesh position={[0, 0.26, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.05, 0.22, 12]} />
              <meshStandardMaterial color="#543d2b" roughness={0.8} />
            </mesh>
            {/* Foliage Clusters */}
            <mesh position={[0, 0.38, 0]} castShadow>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color={item.color} roughness={0.8} />
            </mesh>
            <mesh position={[0.08, 0.33, 0.05]} castShadow>
              <sphereGeometry args={[0.08, 14, 14]} />
              <meshStandardMaterial color={item.color} roughness={0.8} />
            </mesh>
          </group>
        );

      case 'tea_set':
        return (
          <group>
            {/* Wooden Tray */}
            <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.32, 0.02, 0.24]} />
              <meshStandardMaterial color="#451a03" roughness={0.6} />
            </mesh>
            {/* Ceramic Teapot */}
            <mesh position={[-0.06, 0.09, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color={item.color} roughness={0.3} />
            </mesh>
            {/* Teapot Spout */}
            <mesh position={[-0.12, 0.1, 0]} rotation={[0, 0, Math.PI * 0.25]} castShadow>
              <cylinderGeometry args={[0.012, 0.02, 0.06, 8]} />
              <meshStandardMaterial color={item.color} roughness={0.3} />
            </mesh>
            {/* Tea Cups */}
            <mesh position={[0.07, 0.05, -0.05]} castShadow receiveShadow>
              <cylinderGeometry args={[0.03, 0.02, 0.05, 12]} />
              <meshStandardMaterial color={item.color} roughness={0.3} />
            </mesh>
            <mesh position={[0.07, 0.05, 0.05]} castShadow receiveShadow>
              <cylinderGeometry args={[0.03, 0.02, 0.05, 12]} />
              <meshStandardMaterial color={item.color} roughness={0.3} />
            </mesh>
          </group>
        );

      case 'bookshelf_low':
        return (
          <group>
            {/* Outer Frame */}
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.75, 0.68, 0.3]} />
              <meshStandardMaterial color={item.color} roughness={0.7} />
            </mesh>
            {/* Shelf Divider Carve (Hollow Center Visual) */}
            <mesh position={[0, 0.35, 0.02]} receiveShadow>
              <boxGeometry args={[0.67, 0.6, 0.28]} />
              <meshStandardMaterial color="#2d1b0d" roughness={0.8} />
            </mesh>
            {/* Shelf Mid Plank */}
            <mesh position={[0, 0.35, 0.03]} castShadow receiveShadow>
              <boxGeometry args={[0.67, 0.03, 0.26]} />
              <meshStandardMaterial color={item.color} roughness={0.7} />
            </mesh>
            {/* Books in bottom tier */}
            <mesh position={[-0.18, 0.18, 0.03]} castShadow>
              <boxGeometry args={[0.18, 0.24, 0.2]} />
              <meshStandardMaterial color="#0284c7" roughness={0.6} />
            </mesh>
            <mesh position={[0.05, 0.16, 0.03]} castShadow>
              <boxGeometry args={[0.15, 0.2, 0.2]} />
              <meshStandardMaterial color="#dc2626" roughness={0.6} />
            </mesh>
          </group>
        );

      case 'guitar_stand':
        return (
          <group>
            {/* Metal Stand Base */}
            <mesh position={[0, 0.04, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Stand Stem */}
            <mesh position={[0, 0.45, -0.05]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.85, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Guitar Body */}
            <mesh position={[0, 0.4, 0.02]} rotation={[0.15, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.34, 0.48, 0.1]} />
              <meshStandardMaterial color={item.color} roughness={0.4} />
            </mesh>
            {/* Guitar Neck */}
            <mesh position={[0, 0.74, 0.07]} rotation={[0.15, 0, 0]} castShadow>
              <boxGeometry args={[0.06, 0.42, 0.04]} />
              <meshStandardMaterial color="#451a03" roughness={0.5} />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh position={[0, item.colliderSize[1] / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={item.colliderSize} />
            <meshStandardMaterial color={item.color} roughness={0.6} />
          </mesh>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
      onClick={handleClick}
    >
      {renderMesh()}

      {/* Selection Highlight indicator */}
      {isSelected && isEditMode && (
        <group position={[0, 0.01, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[
                Math.max(item.colliderSize[0], item.colliderSize[2]) * 0.55,
                Math.max(item.colliderSize[0], item.colliderSize[2]) * 0.62,
                32
              ]}
            />
            <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
          </mesh>
          {/* Subtle bounding box wireframe */}
          <mesh position={[0, item.colliderSize[1] / 2, 0]}>
            <boxGeometry args={item.colliderSize} />
            <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.35} />
          </mesh>
        </group>
      )}
    </group>
  );
}
