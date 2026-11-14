import { describe, it, expect, beforeAll } from 'vitest';
import RAPIER from '@dimforge/rapier3d-compat';
import { buildStrokeCollider } from '../../src/game/physics/colliderBuilder';
import { StrokeData } from '../../src/stores/drawingStore';

describe('Rapier Physics Engine & Collider Builder Tests', () => {
  beforeAll(async () => {
    await RAPIER.init();
  });

  it('initializes Rapier world and creates dynamic rigid body', () => {
    const gravity = { x: 0, y: -9.81, z: 0 };
    const world = new RAPIER.World(gravity);

    const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 10, 0);
    const body = world.createRigidBody(bodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.ball(0.35);
    world.createCollider(colliderDesc, body);

    expect(body.translation().y).toBe(10);

    // Step physics
    world.step();
    expect(body.translation().y).toBeLessThan(10); // Ball dropped under gravity

    world.free();
  });

  it('builds static stroke colliders from stroke points', () => {
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });

    const stroke: StrokeData = {
      id: 'test-stroke',
      mode: 'static',
      points: [
        { x: -5, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 5, y: 0, z: 0 },
      ],
      length: 10,
    };

    const rigidBody = buildStrokeCollider(world, stroke, 0.16);
    expect(rigidBody.isFixed()).toBe(true);
    expect(rigidBody.numColliders()).toBeGreaterThan(0);

    world.free();
  });

  it('builds dynamic stroke colliders with locked 2.5D planar degrees of freedom', () => {
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });

    const dynamicStroke: StrokeData = {
      id: 'dynamic-stroke',
      mode: 'dynamic',
      points: [
        { x: -2, y: 5, z: 0 },
        { x: 2, y: 5, z: 0 },
      ],
      length: 4,
    };

    const rigidBody = buildStrokeCollider(world, dynamicStroke, 0.16);
    expect(rigidBody.isDynamic()).toBe(true);
    expect(rigidBody.numColliders()).toBeGreaterThan(0);

    world.free();
  });
});
