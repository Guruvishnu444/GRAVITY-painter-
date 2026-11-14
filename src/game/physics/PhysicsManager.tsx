import { FC, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { useGameStore, GravityDirection } from '../../stores/gameStore';
import { useDrawingStore } from '../../stores/drawingStore';
import { buildStrokeCollider } from './colliderBuilder';
import { marbleMaterial } from '../rendering/materials';

const SPAWN_POS: [number, number, number] = [-8, 4.0, 0];
const TARGET_POS: [number, number, number] = [6, -2.5, 0];

export const PhysicsManager: FC = () => {
  const [initialized, setInitialized] = useState(false);
  const worldRef = useRef<RAPIER.World | null>(null);
  const marbleBodyRef = useRef<RAPIER.RigidBody | null>(null);
  const marbleMeshRef = useRef<THREE.Mesh>(null);
  const strokeBodiesRef = useRef<Map<string, RAPIER.RigidBody>>(new Map());

  const currentGravityRef = useRef<THREE.Vector3>(new THREE.Vector3(0, -9.81, 0));
  const targetGravityRef = useRef<THREE.Vector3>(new THREE.Vector3(0, -9.81, 0));
  const dwellTimerRef = useRef<number>(0);

  const status = useGameStore((state) => state.status);
  const gravityDirection = useGameStore((state) => state.gravityDirection);
  const strokes = useDrawingStore((state) => state.strokes);

  // Initialize Rapier WASM and create the physical world
  useEffect(() => {
    let mounted = true;
    RAPIER.init().then(() => {
      if (!mounted) return;

      const gravity = { x: 0, y: -9.81, z: 0 };
      const world = new RAPIER.World(gravity);
      worldRef.current = world;

      // 1. Create Static Environment Colliders (Level 1)
      // Starting platform: [-7.5, 3.25, 0] size [5, 0.5, 2] -> halfExtents: [2.5, 0.25, 1.0]
      world.createCollider(
        RAPIER.ColliderDesc.cuboid(2.5, 0.25, 1.0)
          .setTranslation(-7.5, 3.25, 0)
          .setFriction(0.4)
          .setRestitution(0.2)
      );

      // Starting bumper: [-10.1, 4.25, 0] size [0.4, 2, 2] -> halfExtents: [0.2, 1.0, 1.0]
      world.createCollider(
        RAPIER.ColliderDesc.cuboid(0.2, 1.0, 1.0)
          .setTranslation(-10.1, 4.25, 0)
          .setFriction(0.4)
          .setRestitution(0.2)
      );

      // Target platform: [6, -3.25, 0] size [6, 0.5, 2] -> halfExtents: [3.0, 0.25, 1.0]
      world.createCollider(
        RAPIER.ColliderDesc.cuboid(3.0, 0.25, 1.0)
          .setTranslation(6, -3.25, 0)
          .setFriction(0.4)
          .setRestitution(0.2)
      );

      // 2. Create Dynamic Marble RigidBody
      const marbleDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(SPAWN_POS[0], SPAWN_POS[1], SPAWN_POS[2])
        .setLinearDamping(0.1)
        .setAngularDamping(0.2)
        .setCcdEnabled(true);

      const marbleBody = world.createRigidBody(marbleDesc);
      marbleBody.setEnabledTranslations(true, true, false, true); // Z-axis locked
      marbleBody.setEnabledRotations(false, false, true, true);   // Only Z rotation free

      const marbleColliderDesc = RAPIER.ColliderDesc.ball(0.35)
        .setFriction(0.4)
        .setRestitution(0.25)
        .setDensity(1.0);

      world.createCollider(marbleColliderDesc, marbleBody);
      marbleBodyRef.current = marbleBody;

      setInitialized(true);
    });

    return () => {
      mounted = false;
      if (worldRef.current) {
        worldRef.current.free();
        worldRef.current = null;
      }
    };
  }, []);

  // Update target gravity vector when gravityDirection changes
  useEffect(() => {
    const MAGNITUDE = 9.81;
    switch (gravityDirection as GravityDirection) {
      case 'up':
        targetGravityRef.current.set(0, MAGNITUDE, 0);
        break;
      case 'left':
        targetGravityRef.current.set(-MAGNITUDE, 0, 0);
        break;
      case 'right':
        targetGravityRef.current.set(MAGNITUDE, 0, 0);
        break;
      case 'down':
      default:
        targetGravityRef.current.set(0, -MAGNITUDE, 0);
        break;
    }
  }, [gravityDirection]);

  // Sync Stroke Colliders when drawingStore strokes change
  useEffect(() => {
    const world = worldRef.current;
    if (!world || !initialized) return;

    const currentMap = strokeBodiesRef.current;
    const activeIds = new Set(strokes.map((s) => s.id));

    // Remove deleted strokes
    for (const [id, body] of currentMap.entries()) {
      if (!activeIds.has(id)) {
        world.removeRigidBody(body);
        currentMap.delete(id);
      }
    }

    // Add new strokes
    for (const stroke of strokes) {
      if (!currentMap.has(stroke.id)) {
        const body = buildStrokeCollider(world, stroke, 0.16);
        currentMap.set(stroke.id, body);
      }
    }
  }, [strokes, initialized]);

  // Handle Play / Reset state changes
  useEffect(() => {
    const marbleBody = marbleBodyRef.current;
    if (!marbleBody) return;

    if (status === 'READY') {
      // Hold marble in spawn cradle
      marbleBody.setTranslation({ x: SPAWN_POS[0], y: SPAWN_POS[1], z: SPAWN_POS[2] }, true);
      marbleBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      marbleBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
      marbleBody.sleep();
      dwellTimerRef.current = 0;
    } else if (status === 'RUNNING') {
      marbleBody.wakeUp();
    }
  }, [status]);

  // Simulation Step in useFrame
  useFrame((_, delta) => {
    const world = worldRef.current;
    const marbleBody = marbleBodyRef.current;
    const marbleMesh = marbleMeshRef.current;
    if (!world || !marbleBody || !marbleMesh) return;

    // Smooth Gravity Lerp
    currentGravityRef.current.lerp(targetGravityRef.current, Math.min(1.0, delta * 8));
    world.gravity = {
      x: currentGravityRef.current.x,
      y: currentGravityRef.current.y,
      z: 0,
    };

    // Step physics if simulation is running
    if (status === 'RUNNING') {
      // Step with fixed delta
      world.step();

      // Check win condition (Dwell in target pocket)
      const pos = marbleBody.translation();
      const linvel = marbleBody.linvel();
      const speed = Math.sqrt(linvel.x * linvel.x + linvel.y * linvel.y);
      const dx = pos.x - TARGET_POS[0];
      const dy = pos.y - TARGET_POS[1];
      const distToTarget = Math.sqrt(dx * dx + dy * dy);

      if (distToTarget < 1.0 && speed < 1.2) {
        dwellTimerRef.current += delta;
        if (dwellTimerRef.current >= 0.5) {
          useGameStore.getState().setStatus('WON');
        }
      } else {
        dwellTimerRef.current = 0;
      }

      // Auto-reset if marble falls out of world boundary
      if (pos.y < -12 || pos.y > 15 || pos.x < -16 || pos.x > 16) {
        useGameStore.getState().resetGame();
      }
    }

    // Direct Ref Sync from Rapier to Three.js Mesh
    const trans = marbleBody.translation();
    const rot = marbleBody.rotation();
    marbleMesh.position.set(trans.x, trans.y, trans.z);
    marbleMesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
  });

  return (
    <mesh ref={marbleMeshRef} position={SPAWN_POS} castShadow material={marbleMaterial}>
      <sphereGeometry args={[0.35, 32, 32]} />
    </mesh>
  );
};
