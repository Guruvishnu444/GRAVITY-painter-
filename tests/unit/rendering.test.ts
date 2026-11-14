import { describe, it, expect } from 'vitest';
import * as THREE from 'three';

describe('3D Rendering Coordinate & Material Tests', () => {
  it('instantiates orthographic camera with calibrated parameters', () => {
    const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 100);
    camera.position.set(0, 0, 25);
    camera.zoom = 36;
    camera.updateProjectionMatrix();

    expect(camera.position.z).toBe(25);
    expect(camera.zoom).toBe(36);
  });

  it('verifies 2.5D vertical interaction plane intersection math', () => {
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Z = 0 plane
    const raycaster = new THREE.Raycaster(
      new THREE.Vector3(2, 3, 20),
      new THREE.Vector3(0, 0, -1).normalize()
    );

    const intersectionPoint = new THREE.Vector3();
    const result = raycaster.ray.intersectPlane(plane, intersectionPoint);

    expect(result).not.toBeNull();
    expect(intersectionPoint.x).toBeCloseTo(2);
    expect(intersectionPoint.y).toBeCloseTo(3);
    expect(intersectionPoint.z).toBeCloseTo(0);
  });
});
