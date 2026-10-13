'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { EntryScreen } from '@/components/ui/EntryScreen';
import { HUD } from '@/components/ui/HUD';
import { InteractionPrompt } from '@/components/ui/InteractionPrompt';
import { HelmetHangerDetailsPanel } from '@/components/ui/HelmetHangerDetailsPanel';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { FurnitureToolbar } from '@/components/ui/FurnitureToolbar';
import { SettingsModal } from '@/components/ui/SettingsModal';
import { InstructionsOverlay } from '@/components/ui/InstructionsOverlay';
import { MobileControls } from '@/components/ui/MobileControls';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useMobileDetection } from '@/hooks/useTouchControls';

// Dynamically import Three.js canvas for client-side rendering
const RoomScene = dynamic(
  () => import('@/components/canvas/RoomScene').then((mod) => mod.RoomScene),
  { ssr: false }
);

export default function Home() {
  useMobileDetection();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
      <RoomScene />
      <LoadingScreen />
      <EntryScreen />
      <HUD />
      <InteractionPrompt />
      <HelmetHangerDetailsPanel />
      <CartDrawer />
      <FurnitureToolbar />
      <SettingsModal />
      <InstructionsOverlay />
      <MobileControls />
    </main>
  );
}
