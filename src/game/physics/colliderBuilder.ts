import RAPIER from '@dimforge/rapier3d-compat';
import { StrokeData } from '../../stores/drawingStore';

/**
 * Builds physical colliders in the Rapier World for a given stroke.
 * Generates a chain of capsule segments along the stroke path.
 */
export function buildStrokeCollider(
  world: RAPIER.World,
  stroke: StrokeData,
  radius: number = 0.16
): RAPIER.RigidBody {
  const points = stroke.points;
  const isDynamic = stroke.mode === 'dynamic';

  // Create rigid body
  const bodyDesc = isDynamic
    ? RAPIER.RigidBodyDesc.dynamic()
        .setLinearDamping(0.3)
        .setAngularDamping(0.4)
    : RAPIER.RigidBodyDesc.fixed();

  const rigidBody = world.createRigidBody(bodyDesc);

  // Filter points to prevent overly dense overlapping colliders
  const filteredPoints = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const last = filteredPoints[filteredPoints.length - 1];
    const dx = points[i].x - last.x;
    const dy = points[i].y - last.y;
    if (dx * dx + dy * dy >= 0.09) { // ~0.3 unit spacing
      filteredPoints.push(points[i]);
    }
  }
  if (filteredPoints.length < 2 && points.length >= 2) {
    filteredPoints.push(points[points.length - 1]);
  }

  // Create capsule colliders between consecutive points
  for (let i = 0; i < filteredPoints.length - 1; i++) {
    const p1 = filteredPoints[i];
    const p2 = filteredPoints[i + 1];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);
    if (segmentLength < 0.05) continue;

    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const angle = Math.atan2(dy, dx);

    // Half-height of the cylinder segment inside the capsule
    const halfHeight = Math.max(0.01, (segmentLength - radius * 2) / 2);

    const colliderDesc = RAPIER.ColliderDesc.capsule(halfHeight, radius)
      .setTranslation(midX, midY, 0)
      .setRotation({
        x: 0,
        y: 0,
        z: Math.sin(angle / 2),
        w: Math.cos(angle / 2),
      })
      .setFriction(0.4)
      .setRestitution(0.2);

    world.createCollider(colliderDesc, rigidBody);
  }

  // If dynamic, lock motion to the 2.5D vertical plane (Z = 0)
  if (isDynamic) {
    rigidBody.lockTranslations(false, false);
    rigidBody.setEnabledTranslations(true, true, false, true); // X and Y free, Z locked
    rigidBody.setEnabledRotations(false, false, true, true);   // Only Z-axis rotation free
  }

  return rigidBody;
}
