'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, store } from '@/state/useStore';
import { HELMET_HANGER_PRODUCT } from '@/config/productData';

export function ProductTargeting() {
  const { camera } = useThree();
  const { isEntered, isProductPanelOpen } = useStore();

  const productCenter = useRef<THREE.Vector3>(
    new THREE.Vector3(
      HELMET_HANGER_PRODUCT.roomPosition[0] - 0.15,
      HELMET_HANGER_PRODUCT.roomPosition[1],
      HELMET_HANGER_PRODUCT.roomPosition[2]
    )
  );
  const dirToProduct = useRef<THREE.Vector3>(new THREE.Vector3());
  const cameraDir = useRef<THREE.Vector3>(new THREE.Vector3());

  useFrame(() => {
    if (!isEntered || isProductPanelOpen) {
      store.setHelmetHangerTargeted(false);
      return;
    }

    const dist = camera.position.distanceTo(productCenter.current);

    if (dist <= HELMET_HANGER_PRODUCT.interactionDistance) {
      // Vector from camera to product
      dirToProduct.current
        .subVectors(productCenter.current, camera.position)
        .normalize();

      // Camera forward direction
      camera.getWorldDirection(cameraDir.current);

      // Dot product measures alignment with crosshair
      const alignment = cameraDir.current.dot(dirToProduct.current);

      // Must be looking closely at the product (cone ~25 degrees)
      if (alignment > 0.88) {
        store.setHelmetHangerTargeted(true);
        return;
      }
    }

    store.setHelmetHangerTargeted(false);
  });

  // Global F-key and Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyF') {
        const current = store.getState();
        if (
          current.isHelmetHangerTargeted &&
          !current.isProductPanelOpen &&
          current.isEntered
        ) {
          e.preventDefault();
          store.openProductPanel();
        }
      }

      if (e.code === 'Escape') {
        const current = store.getState();
        if (current.isProductPanelOpen) {
          e.preventDefault();
          store.closeProductPanel();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}
