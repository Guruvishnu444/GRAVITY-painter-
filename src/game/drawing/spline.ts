import * as THREE from 'three';
import { StrokePoint } from '../../stores/drawingStore';

/**
 * Samples and smooths raw 2.5D stroke points using a Catmull-Rom spline.
 * Decimates redundant points and ensures organic curve flow.
 */
export function smoothStrokePoints(
  rawPoints: StrokePoint[],
  minDistance: number = 0.25,
  samplesPerSegment: number = 8
): StrokePoint[] {
  if (rawPoints.length < 2) return [...rawPoints];

  // 1. Distance filtering
  const filtered: THREE.Vector3[] = [new THREE.Vector3(rawPoints[0].x, rawPoints[0].y, 0)];
  for (let i = 1; i < rawPoints.length; i++) {
    const pt = new THREE.Vector3(rawPoints[i].x, rawPoints[i].y, 0);
    const last = filtered[filtered.length - 1];
    if (last.distanceTo(pt) >= minDistance) {
      filtered.push(pt);
    }
  }

  // Ensure end point is included
  const lastRaw = rawPoints[rawPoints.length - 1];
  const lastFiltered = filtered[filtered.length - 1];
  if (lastFiltered.distanceTo(new THREE.Vector3(lastRaw.x, lastRaw.y, 0)) > 0.05) {
    filtered.push(new THREE.Vector3(lastRaw.x, lastRaw.y, 0));
  }

  if (filtered.length < 2) return [...rawPoints];
  if (filtered.length === 2) {
    return [
      { x: filtered[0].x, y: filtered[0].y, z: 0 },
      { x: filtered[1].x, y: filtered[1].y, z: 0 },
    ];
  }

  // 2. Catmull-Rom interpolation
  const curve = new THREE.CatmullRomCurve3(filtered, false, 'centripetal', 0.5);
  const totalSamples = Math.max(12, filtered.length * samplesPerSegment);
  const points = curve.getPoints(totalSamples);

  return points.map((p) => ({ x: p.x, y: p.y, z: 0 }));
}

/**
 * Computes the total Euclidean length of a stroke.
 */
export function calculateStrokeLength(points: StrokePoint[]): number {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total;
}
