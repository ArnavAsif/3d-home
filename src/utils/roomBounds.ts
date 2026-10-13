import { RoomBounds, ColliderAABB } from '@/types';
import { HELMET_HANGER_PRODUCT } from '@/config/productData';

// Natural scale of the authentic vintage living room model
export const ROOM_SCALE = 1.0;

// Precise architectural boundaries of the enclosed 12m vintage living room (in meters)
export const ROOM_BOUNDS: RoomBounds = {
  minX: -2.70,   // West wall (wainscoted accent wall)
  maxX: 8.95,    // East entrance wall (door and mudroom display)
  minZ: -4.90,   // North wall (French windows with curtains)
  maxZ: 4.95,    // South wall (back wall with sideboard and sconces)
  floorY: 0.00,  // Hardwood floor surface level
  ceilingY: 3.95 // Lofty 4.0m architectural ceiling level
};

// Spawn position standing in front of the entrance door facing directly towards the Helmet Hanger
export const DEFAULT_SPAWN_POSITION: [number, number, number] = [7.2, 1.65, 0.4];
// Camera yaw pointing directly at the wall-mounted Helmet Hanger (X=9.15, Z=1.35)
export const DEFAULT_SPAWN_ROTATION: [number, number] = [0, -2.03];

// Authentic room obstacle colliders based on exact model geometry
export const STATIC_ROOM_COLLIDERS: ColliderAABB[] = [
  // The Featured Helmet Hanger display & entryway console bench
  {
    id: 'featured_helmet_hanger_collider',
    name: 'Featured Helmet Hanger Stand',
    min: [8.85, 0.0, 0.85],
    max: [9.25, 1.95, 1.85]
  },
  // Vintage Sectional Sofa - Main Back / North Couch
  {
    id: 'vintage_sofa_back',
    name: 'Vintage Sofa Lounge Section',
    min: [-2.65, 0.0, -3.15],
    max: [2.60, 0.95, -1.50]
  },
  // Vintage Sectional Sofa - West Chaise / Arm
  {
    id: 'vintage_sofa_west',
    name: 'Vintage Sofa Left Arm',
    min: [-2.65, 0.0, -1.50],
    max: [-1.40, 0.95, 3.30]
  },
  // Vintage Sectional Sofa - East Armrest
  {
    id: 'vintage_sofa_east',
    name: 'Vintage Sofa Right Wing',
    min: [1.30, 0.0, -1.50],
    max: [2.60, 0.95, 2.50]
  },
  // Central Vintage Coffee Table
  {
    id: 'vintage_coffee_table',
    name: 'Living Room Coffee Table',
    min: [-1.45, 0.0, -2.88],
    max: [1.68, 0.80, 1.25]
  },
  // South Wall Credenza / Sideboard Cabinet
  {
    id: 'vintage_credenza_south',
    name: 'South Wall Console Credenza',
    min: [-1.64, 0.0, 3.20],
    max: [2.95, 1.50, 5.24]
  },
  // Corner Floor Lamp & Potted Plants
  {
    id: 'vintage_corner_plants',
    name: 'Floor Lamp & Potted Plants',
    min: [-2.80, 0.0, 2.10],
    max: [-0.60, 2.50, 5.24]
  }
];
