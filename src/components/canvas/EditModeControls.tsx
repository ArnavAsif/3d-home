'use client';

import React, { useRef, useEffect } from 'react';
import { OrbitControls, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { useStore, store } from '@/state/useStore';
import { ROOM_BOUNDS } from '@/utils/roomBounds';

export function EditModeControls() {
  const {
    appMode,
    selectedFurnitureId,
    furnitureList,
    transformMode
  } = useStore();

  const isEditMode = appMode === 'edit';
  const orbitRef = useRef<any>(null);
  const transformRef = useRef<any>(null);
  const dummyRef = useRef<THREE.Group>(null);

  const selectedItem = furnitureList.find(f => f.id === selectedFurnitureId);

  // Synchronize proxy dummy object with selected furniture item
  useEffect(() => {
    if (!dummyRef.current || !selectedItem) return;
    dummyRef.current.position.set(...selectedItem.position);
    dummyRef.current.rotation.set(...selectedItem.rotation);
    dummyRef.current.scale.set(...selectedItem.scale);
  }, [selectedItem]);

  // Disable orbit controls while dragging with TransformControls
  useEffect(() => {
    const transform = transformRef.current;
    if (!transform) return;

    const handleDraggingChanged = (event: any) => {
      if (orbitRef.current) {
        orbitRef.current.enabled = !event.value;
      }

      // On drag end, commit transform to store
      if (!event.value && dummyRef.current && selectedItem) {
        const dummy = dummyRef.current;

        // Floor snapping (Y = 0)
        let newX = dummy.position.x;
        let newY = ROOM_BOUNDS.floorY;
        let newZ = dummy.position.z;

        // Prevent placing outside room bounds
        const halfW = (selectedItem.colliderSize[0] * dummy.scale.x) / 2;
        const halfD = (selectedItem.colliderSize[2] * dummy.scale.z) / 2;

        newX = Math.max(ROOM_BOUNDS.minX + halfW, Math.min(newX, ROOM_BOUNDS.maxX - halfW));
        newZ = Math.max(ROOM_BOUNDS.minZ + halfD, Math.min(newZ, ROOM_BOUNDS.maxZ - halfD));

        dummy.position.set(newX, newY, newZ);

        store.updateFurniture(selectedItem.id, {
          position: [newX, newY, newZ],
          rotation: [dummy.rotation.x, dummy.rotation.y, dummy.rotation.z],
          scale: [
            Math.max(0.2, Math.min(dummy.scale.x, 3.0)),
            Math.max(0.2, Math.min(dummy.scale.y, 3.0)),
            Math.max(0.2, Math.min(dummy.scale.z, 3.0))
          ]
        });
      }
    };

    transform.addEventListener('dragging-changed', handleDraggingChanged);
    return () => {
      transform.removeEventListener('dragging-changed', handleDraggingChanged);
    };
  }, [selectedItem]);

  if (!isEditMode) return null;

  return (
    <>
      <OrbitControls
        ref={orbitRef}
        makeDefault
        target={[1.5, 0.8, 0.0]}
        maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera going below floor
        minDistance={1.0}
        maxDistance={12.0}
        dampingFactor={0.08}
        enableDamping
      />

      {/* Invisible dummy proxy group that holds TransformControls */}
      {selectedItem && (
        <>
          <group ref={dummyRef} />
          <TransformControls
            ref={transformRef}
            object={dummyRef as any}
            mode={transformMode}
            size={0.65}
            showY={transformMode !== 'translate'} // Snap to floor on translate, only X & Z planes
          />
        </>
      )}
    </>
  );
}
