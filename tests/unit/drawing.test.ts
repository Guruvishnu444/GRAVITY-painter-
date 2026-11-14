import { describe, it, expect } from 'vitest';
import { smoothStrokePoints, calculateStrokeLength } from '../../src/game/drawing/spline';
import { createStrokeGeometry } from '../../src/game/drawing/ribbonGeometry';

describe('Drawing Engine Spline & Geometry Tests', () => {
  it('smooths raw points using Catmull-Rom interpolation', () => {
    const raw = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 0 },
      { x: 2, y: 0, z: 0 },
      { x: 3, y: 1, z: 0 },
    ];
    const smoothed = smoothStrokePoints(raw, 0.2, 4);

    expect(smoothed.length).toBeGreaterThan(raw.length);
    expect(smoothed[0].x).toBeCloseTo(0);
    expect(smoothed[0].y).toBeCloseTo(0);
    expect(smoothed[smoothed.length - 1].x).toBeCloseTo(3);
    expect(smoothed[smoothed.length - 1].y).toBeCloseTo(1);
  });

  it('calculates stroke length accurately', () => {
    const points = [
      { x: 0, y: 0, z: 0 },
      { x: 3, y: 0, z: 0 },
      { x: 3, y: 4, z: 0 },
    ];
    // Distance = 3 + 4 = 7
    const length = calculateStrokeLength(points);
    expect(length).toBeCloseTo(7.0);
  });

  it('generates 3D tube geometry for a valid stroke', () => {
    const points = [
      { x: -2, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 2, y: 0, z: 0 },
    ];
    const geom = createStrokeGeometry(points, 0.16, 0.6);
    expect(geom.getAttribute('position')).toBeDefined();
    expect(geom.getAttribute('position').count).toBeGreaterThan(0);
  });
});
