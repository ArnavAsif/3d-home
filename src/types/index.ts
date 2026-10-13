export type AppMode = 'explore' | 'edit';

export type TransformMode = 'translate' | 'rotate' | 'scale';

export interface PlayerSettings {
  moveSpeed: number;       // Walking speed in m/s (default: 2.2)
  runSpeed: number;        // Running speed in m/s (default: 4.0)
  mouseSensitivity: number;// Sensitivity multiplier (default: 0.0022)
  eyeHeight: number;       // Eye height from floor in meters (default: 1.55)
  playerRadius: number;    // Collision radius in meters (default: 0.28)
  fieldOfView: number;     // FOV in degrees (default: 75)
  headBobbing: boolean;    // Realistic subtle walking bobbing
  showColliders: boolean;  // Debug visualizer for collision bounds
}

export interface ColliderAABB {
  id: string;
  name: string;
  min: [number, number, number];
  max: [number, number, number];
  isFurniture?: boolean;
  furnitureId?: string;
}

export type FurnitureCategory = 'chair' | 'table' | 'bed' | 'storage' | 'lighting' | 'decor' | 'electronics';

export interface FurnitureTemplate {
  type: string;
  name: string;
  category: FurnitureCategory;
  description: string;
  iconName: string;
  defaultScale: [number, number, number];
  defaultColliderSize: [number, number, number]; // [width, height, depth]
  colorOptions?: string[];
  defaultColor?: string;
  modelUrl?: string; // Optional GLB path if custom model
}

export interface PlacedFurniture {
  id: string;
  templateType: string;
  name: string;
  category: FurnitureCategory;
  position: [number, number, number];
  rotation: [number, number, number]; // Euler angles [x, y, z] in radians
  scale: [number, number, number];
  color: string;
  colliderSize: [number, number, number];
  modelUrl?: string;
}

export interface RoomBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  floorY: number;
  ceilingY: number;
}
