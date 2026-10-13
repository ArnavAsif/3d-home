'use client';

import { useState, useEffect } from 'react';
import {
  AppMode,
  TransformMode,
  PlayerSettings,
  PlacedFurniture,
  FurnitureTemplate
} from '@/types';
import { DEFAULT_SPAWN_POSITION } from '@/utils/roomBounds';
import { HELMET_HANGER_PRODUCT } from '@/config/productData';

export const INITIAL_SETTINGS: PlayerSettings = {
  moveSpeed: 2.4,
  runSpeed: 4.2,
  mouseSensitivity: 0.0022,
  eyeHeight: 1.60,
  playerRadius: 0.28,
  fieldOfView: 75,
  headBobbing: true,
  showColliders: false
};

export const FURNITURE_TEMPLATES: FurnitureTemplate[] = [
  {
    type: 'shoji_lantern',
    name: 'Andon Floor Lantern',
    category: 'lighting',
    description: 'Traditional Japanese wooden paper lantern casting warm ambient light',
    iconName: 'Lamp',
    defaultScale: [1, 1, 1],
    defaultColliderSize: [0.35, 0.65, 0.35],
    defaultColor: '#ffebd2',
    colorOptions: ['#ffebd2', '#fde047', '#fed7aa', '#ffffff']
  },
  {
    type: 'floor_cushion',
    name: 'Zabuton Floor Cushion',
    category: 'chair',
    description: 'Comfortable square silk floor seating cushion',
    iconName: 'Armchair',
    defaultScale: [1, 1, 1],
    defaultColliderSize: [0.55, 0.15, 0.55],
    defaultColor: '#c2410c',
    colorOptions: ['#c2410c', '#047857', '#4338ca', '#854d0e', '#374151']
  },
  {
    type: 'wooden_stool',
    name: 'Hinoki Wood Stool',
    category: 'chair',
    description: 'Minimalist solid Japanese cedar stool',
    iconName: 'Chair',
    defaultScale: [1, 1, 1],
    defaultColliderSize: [0.4, 0.45, 0.4],
    defaultColor: '#d97706',
    colorOptions: ['#d97706', '#92400e', '#451a03', '#fef3c7']
  },
  {
    type: 'bonsai_plant',
    name: 'Miniature Bonsai Pine',
    category: 'decor',
    description: 'Artistic evergreen bonsai in an earthenware pot',
    iconName: 'Flower2',
    defaultScale: [1, 1, 1],
    defaultColliderSize: [0.35, 0.55, 0.35],
    defaultColor: '#15803d',
    colorOptions: ['#15803d', '#166534', '#14532d']
  }
];

interface AppState {
  appMode: AppMode;
  isEntered: boolean;
  isPointerLocked: boolean;
  isLoading: boolean;
  loadingProgress: number;
  loadingError: string | null;
  settings: PlayerSettings;
  playerPosition: [number, number, number];
  resetTrigger: number;
  furnitureList: PlacedFurniture[];
  selectedFurnitureId: string | null;
  transformMode: TransformMode;
  isSettingsOpen: boolean;
  isHelpOpen: boolean;
  isMobile: boolean;

  // Helmet Hanger product experience state
  isHelmetHangerTargeted: boolean;
  isProductPanelOpen: boolean;
  selectedVariantId: string;
  selectedQuantity: number;
}

let state: AppState = {
  appMode: 'explore',
  isEntered: false,
  isPointerLocked: false,
  isLoading: true,
  loadingProgress: 0,
  loadingError: null,
  settings: { ...INITIAL_SETTINGS },
  playerPosition: [...DEFAULT_SPAWN_POSITION],
  resetTrigger: 0,
  furnitureList: [],
  selectedFurnitureId: null,
  transformMode: 'translate',
  isSettingsOpen: false,
  isHelpOpen: false,
  isMobile: false,

  isHelmetHangerTargeted: false,
  isProductPanelOpen: false,
  selectedVariantId: HELMET_HANGER_PRODUCT.variants[0].id,
  selectedQuantity: 1
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

export const store = {
  getState: () => state,

  setAppMode: (mode: AppMode) => {
    state = { ...state, appMode: mode };
    notify();
  },

  setIsEntered: (entered: boolean) => {
    state = { ...state, isEntered: entered };
    notify();
  },

  setIsPointerLocked: (locked: boolean) => {
    state = { ...state, isPointerLocked: locked };
    notify();
  },

  setLoading: (loading: boolean, progress = 100, error: string | null = null) => {
    state = { ...state, isLoading: loading, loadingProgress: progress, loadingError: error };
    notify();
  },

  updateSettings: (newSettings: Partial<PlayerSettings>) => {
    state = { ...state, settings: { ...state.settings, ...newSettings } };
    notify();
  },

  setPlayerPosition: (pos: [number, number, number]) => {
    state = { ...state, playerPosition: pos };
  },

  triggerResetPosition: () => {
    state = { ...state, resetTrigger: state.resetTrigger + 1 };
    notify();
  },

  setTransformMode: (mode: TransformMode) => {
    state = { ...state, transformMode: mode };
    notify();
  },

  selectFurniture: (id: string | null) => {
    state = { ...state, selectedFurnitureId: id };
    notify();
  },

  addFurniture: (templateType: string, position?: [number, number, number]) => {
    const tmpl = FURNITURE_TEMPLATES.find(t => t.type === templateType);
    if (!tmpl) return;

    const targetPos: [number, number, number] = position || [
      Math.max(0.5, Math.min(state.playerPosition[0] + 1.2, 4.5)),
      0.0,
      Math.max(-1.5, Math.min(state.playerPosition[2], 1.5))
    ];

    const newItem: PlacedFurniture = {
      id: `placed_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      templateType: tmpl.type,
      name: tmpl.name,
      category: tmpl.category,
      position: targetPos,
      rotation: [0, 0, 0],
      scale: [...tmpl.defaultScale],
      color: tmpl.defaultColor || '#cccccc',
      colliderSize: [...tmpl.defaultColliderSize],
      modelUrl: tmpl.modelUrl
    };

    state = {
      ...state,
      furnitureList: [...state.furnitureList, newItem],
      selectedFurnitureId: newItem.id
    };
    notify();
  },

  updateFurniture: (id: string, updates: Partial<PlacedFurniture>) => {
    state = {
      ...state,
      furnitureList: state.furnitureList.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    };
    notify();
  },

  deleteFurniture: (id: string) => {
    state = {
      ...state,
      furnitureList: state.furnitureList.filter(item => item.id !== id),
      selectedFurnitureId: state.selectedFurnitureId === id ? null : state.selectedFurnitureId
    };
    notify();
  },

  setIsSettingsOpen: (open: boolean) => {
    state = { ...state, isSettingsOpen: open };
    notify();
  },

  setIsHelpOpen: (open: boolean) => {
    state = { ...state, isHelpOpen: open };
    notify();
  },

  setIsMobile: (mobile: boolean) => {
    state = { ...state, isMobile: mobile };
    notify();
  },

  // Helmet Hanger actions
  setHelmetHangerTargeted: (targeted: boolean) => {
    if (state.isHelmetHangerTargeted !== targeted) {
      state = { ...state, isHelmetHangerTargeted: targeted };
      notify();
    }
  },

  openProductPanel: () => {
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }
    state = { ...state, isProductPanelOpen: true };
    notify();
  },

  closeProductPanel: () => {
    state = { ...state, isProductPanelOpen: false };
    notify();
  },

  setSelectedVariant: (variantId: string) => {
    state = { ...state, selectedVariantId: variantId };
    notify();
  },

  setSelectedQuantity: (qty: number) => {
    state = { ...state, selectedQuantity: Math.max(1, qty) };
    notify();
  }
};

export function useStore(): AppState {
  const [current, setCurrent] = useState<AppState>(state);

  useEffect(() => {
    const listener = () => setCurrent(state);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return current;
}
