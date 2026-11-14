import * as THREE from 'three';
import { StrokePoint } from '../../stores/drawingStore';

/**
 * Creates an extruded 3D ribbon / capsule strip from a sequence of 2.5D points.
 * Thickness in the 2D plane: radius * 2.
 * Depth in Z axis: depth.
 */
export function createStrokeGeometry(
  points: StrokePoint[],
  radius: number = 0.16,
  depth: number = 0.6
): THREE.BufferGeometry {
  if (points.length < 2) {
    return new THREE.BufferGeometry();
  }

  // Convert points to 3D curve
  const vectors = points.map((p) => new THREE.Vector3(p.x, p.y, p.z || 0));
  const curve = new THREE.CatmullRomCurve3(vectors);

  // Generate a tubular geometry with smooth rounded cross section
  const tubularSegments = Math.max(16, points.length * 4);
  const radialSegments = 8;
  const tubeGeom = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);

  // Scale depth along Z axis to make it an extruded track
  tubeGeom.scale(1, 1, depth / (radius * 2));
  tubeGeom.computeVertexNormals();

  return tubeGeom;
}
