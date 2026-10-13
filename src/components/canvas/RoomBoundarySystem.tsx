'use client';

import React from 'react';
import { useStore } from '@/state/useStore';
import { ROOM_BOUNDS, STATIC_ROOM_COLLIDERS } from '@/utils/roomBounds';
import { computeFurnitureAABB } from '@/utils/collision';

export function RoomBoundarySystem() {
  const { settings, furnitureList } = useStore();

  if (!settings.showColliders) return null;

  const furnitureColliders = furnitureList.map(f =>
    computeFurnitureAABB(f.id, f.name, f.position, f.scale, f.colliderSize)
  );

  return (
    <group name="DebugColliders">
      {/* Outer Room Boundary Wireframe */}
      <mesh
        position={[
          (ROOM_BOUNDS.minX + ROOM_BOUNDS.maxX) / 2,
          (ROOM_BOUNDS.floorY + ROOM_BOUNDS.ceilingY) / 2,
          (ROOM_BOUNDS.minZ + ROOM_BOUNDS.maxZ) / 2
        ]}
      >
        <boxGeometry
          args={[
            ROOM_BOUNDS.maxX - ROOM_BOUNDS.minX,
            ROOM_BOUNDS.ceilingY - ROOM_BOUNDS.floorY,
            ROOM_BOUNDS.maxZ - ROOM_BOUNDS.minZ
          ]}
        />
        <meshBasicMaterial color="#ef4444" wireframe transparent opacity={0.4} />
      </mesh>

      {/* Static GLB Obstacle Colliders */}
      {STATIC_ROOM_COLLIDERS.map(c => {
        const sx = c.max[0] - c.min[0];
        const sy = c.max[1] - c.min[1];
        const sz = c.max[2] - c.min[2];
        const cx = (c.min[0] + c.max[0]) / 2;
        const cy = (c.min[1] + c.max[1]) / 2;
        const cz = (c.min[2] + c.max[2]) / 2;

        return (
          <mesh key={c.id} position={[cx, cy, cz]}>
            <boxGeometry args={[sx, sy, sz]} />
            <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.7} />
          </mesh>
        );
      })}

      {/* Dynamic Placed Furniture Colliders */}
      {furnitureColliders.map(c => {
        const sx = c.max[0] - c.min[0];
        const sy = c.max[1] - c.min[1];
        const sz = c.max[2] - c.min[2];
        const cx = (c.min[0] + c.max[0]) / 2;
        const cy = (c.min[1] + c.max[1]) / 2;
        const cz = (c.min[2] + c.max[2]) / 2;

        return (
          <mesh key={c.id} position={[cx, cy, cz]}>
            <boxGeometry args={[sx, sy, sz]} />
            <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}
