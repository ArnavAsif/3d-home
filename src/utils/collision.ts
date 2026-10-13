import { ColliderAABB, RoomBounds } from '@/types';

/**
 * Checks and resolves collision between a 2D circle (player horizontally) and an AABB.
 * Returns the resolved position [x, z] and whether a collision occurred.
 */
export function resolveCircleAABB(
  px: number,
  pz: number,
  radius: number,
  box: ColliderAABB
): { x: number; z: number; collided: boolean } {
  // Find closest point on AABB to circle center
  const closestX = Math.max(box.min[0], Math.min(px, box.max[0]));
  const closestZ = Math.max(box.min[2], Math.min(pz, box.max[2]));

  const diffX = px - closestX;
  const diffZ = pz - closestZ;
  const distSq = diffX * diffX + diffZ * diffZ;

  // Circle is outside box and distance >= radius
  if (distSq >= radius * radius) {
    return { x: px, z: pz, collided: false };
  }

  // Inside or overlapping
  const dist = Math.sqrt(distSq);

  if (dist > 0.0001) {
    // Normal case: push radially out from closest point
    const penetration = radius - dist;
    const nx = diffX / dist;
    const nz = diffZ / dist;
    return {
      x: px + nx * penetration,
      z: pz + nz * penetration,
      collided: true
    };
  } else {
    // Center is directly inside box: find shallowest axis to push out
    const dLeft = Math.abs(px - box.min[0]);
    const dRight = Math.abs(box.max[0] - px);
    const dFront = Math.abs(pz - box.min[2]);
    const dBack = Math.abs(box.max[2] - pz);

    const minD = Math.min(dLeft, dRight, dFront, dBack);

    let resX = px;
    let resZ = pz;

    if (minD === dLeft) resX = box.min[0] - radius;
    else if (minD === dRight) resX = box.max[0] + radius;
    else if (minD === dFront) resZ = box.min[2] - radius;
    else resZ = box.max[2] + radius;

    return { x: resX, z: resZ, collided: true };
  }
}

/**
 * Performs continuous collision detection with sub-stepping, wall sliding,
 * obstacle avoidance, and strict room boundary enforcement.
 */
export function moveWithCollision(
  startPos: [number, number, number],
  deltaMovement: [number, number, number],
  radius: number,
  bounds: RoomBounds,
  colliders: ColliderAABB[]
): [number, number, number] {
  const moveDist = Math.hypot(deltaMovement[0], deltaMovement[2]);
  const maxStepSize = radius * 0.4; // Small enough to never tunnel
  const numSteps = Math.max(1, Math.ceil(moveDist / maxStepSize));

  const stepDx = deltaMovement[0] / numSteps;
  const stepDz = deltaMovement[2] / numSteps;

  let currentX = startPos[0];
  let currentZ = startPos[2];

  for (let step = 0; step < numSteps; step++) {
    // Attempt movement on X axis first (enables smooth sliding along Z-facing walls)
    let nextX = currentX + stepDx;
    let testZ = currentZ;

    for (const box of colliders) {
      const res = resolveCircleAABB(nextX, testZ, radius, box);
      nextX = res.x;
      testZ = res.z;
    }

    // Now attempt movement on Z axis (enables smooth sliding along X-facing walls)
    let nextZ = testZ + stepDz;
    for (const box of colliders) {
      const res = resolveCircleAABB(nextX, nextZ, radius, box);
      nextX = res.x;
      nextZ = res.z;
    }

    // Secondary pass against all colliders for sharp corners
    for (const box of colliders) {
      const res = resolveCircleAABB(nextX, nextZ, radius, box);
      nextX = res.x;
      nextZ = res.z;
    }

    // Enforce absolute room boundaries (player can NEVER leave the room)
    const clampedX = Math.max(bounds.minX + radius, Math.min(nextX, bounds.maxX - radius));
    const clampedZ = Math.max(bounds.minZ + radius, Math.min(nextZ, bounds.maxZ - radius));

    currentX = clampedX;
    currentZ = clampedZ;
  }

  return [currentX, startPos[1], currentZ];
}

/**
 * Checks if a proposed point [x, z] with radius is valid (within room bounds and not inside any obstacle)
 */
export function isPositionWalkable(
  px: number,
  pz: number,
  radius: number,
  bounds: RoomBounds,
  colliders: ColliderAABB[]
): boolean {
  if (
    px < bounds.minX + radius ||
    px > bounds.maxX - radius ||
    pz < bounds.minZ + radius ||
    pz > bounds.maxZ - radius
  ) {
    return false;
  }

  for (const box of colliders) {
    const closestX = Math.max(box.min[0], Math.min(px, box.max[0]));
    const closestZ = Math.max(box.min[2], Math.min(pz, box.max[2]));
    const diffX = px - closestX;
    const diffZ = pz - closestZ;
    if (diffX * diffX + diffZ * diffZ < radius * radius) {
      return false;
    }
  }

  return true;
}

/**
 * Computes world AABB collider for an edited/placed furniture item.
 */
export function computeFurnitureAABB(
  furnitureId: string,
  name: string,
  position: [number, number, number],
  scale: [number, number, number],
  colliderSize: [number, number, number]
): ColliderAABB {
  const halfW = (colliderSize[0] * scale[0]) / 2;
  const halfH = colliderSize[1] * scale[1];
  const halfD = (colliderSize[2] * scale[2]) / 2;

  return {
    id: `furniture_${furnitureId}`,
    name,
    isFurniture: true,
    furnitureId,
    min: [position[0] - halfW, position[1], position[2] - halfD],
    max: [position[0] + halfW, position[1] + halfH, position[2] + halfD]
  };
}
