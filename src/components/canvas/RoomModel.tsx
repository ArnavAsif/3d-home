'use client';

import React, { useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { store } from '@/state/useStore';
import { ROOM_SCALE } from '@/utils/roomBounds';

export function RoomModel() {
  const { scene } = useGLTF('/models/room.glb');

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.scale.set(ROOM_SCALE, ROOM_SCALE, ROOM_SCALE);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            mat.side = THREE.DoubleSide;
            if ('roughness' in mat && (mat as any).roughness < 0.2) {
              (mat as any).roughness = 0.4;
            }
          });
        }
      }
    });

    return clone;
  }, [scene]);

  useEffect(() => {
    store.setLoading(false, 100, null);
  }, []);

  return <primitive object={clonedScene} />;
}

useGLTF.preload('/models/room.glb');
