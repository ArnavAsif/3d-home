'use client';

import React from 'react';
import { useStore } from '@/state/useStore';
import { FurnitureItem } from './FurnitureItem';

export function FurnitureManager() {
  const { furnitureList } = useStore();

  return (
    <group name="FurnitureCollection">
      {furnitureList.map((item) => (
        <FurnitureItem key={item.id} item={item} />
      ))}
    </group>
  );
}
