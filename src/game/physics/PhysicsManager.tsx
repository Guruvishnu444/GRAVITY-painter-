import { FC, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { useGameStore, GravityDirection } from '../../stores/gameStore';
import { useDrawingStore } from '../../stores/drawingStore';
import { useSaveStore } from '../../stores/saveStore';
import { getLevelById } from '../levels/levelData';
import { buildStrokeCollider } from './colliderBuilder';
import { marbleMaterial } from '../rendering/materials';
import { sound } from '../../systems/audio/audioManager';

export const PhysicsManager: FC = () => {
  const [initialized, setInitialized] = useState(false);
  const worldRef = useRef<RAPIER.World | null>(null);
  const marbleBodyRef = useRef<RAPIER.RigidBody | null>(null);
  const marbleMeshRef = useRef<THREE.Mesh>(null);
  const strokeBodiesRef = useRef<Map<string, RAPIER.RigidBody>>(new Map());
  const platformCollidersRef = useRef<RAPIER.Collider[]>([]);

  const currentGravityRef = useRef<THREE.Vector3>(new THREE.Vector3(0, -9.81, 0));
  const targetGravityRef = useRef<THREE.Vector3>(new THREE.Vector3(0, -9.81, 0));
  const dwellTimerRef = useRef<number>(0);

  const status = useGameStore((state) => state.status);
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const gravityDirection = useGameStore((state) => state.gravityDirection);
  const strokes = useDrawingStore((state) => state.strokes);

  const level = getLevelById(currentLevelId);

  // Initialize Rapier WASM and create the physical world
  useEffect(() => {
    let mounted = true;
    RAPIER.init().then(() => {
      if (!mounted) return;

      const gravity = { x: 0, y: -9.81, z: 0 };
      const world = new RAPIER.World(gravity);
      worldRef.current = world;

      // Create Dynamic Marble RigidBody
      const marbleDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(level.spawnPosition[0], level.spawnPosition[1], level.spawnPosition[2])
        .setLinearDamping(0.1)
        .setAngularDamping(0.2)
        .setCcdEnabled(true);

      const marbleBody = world.createRigidBody(marbleDesc);
      marbleBody.setEnabledTranslations(true, true, false, true); // Z locked
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

  // Update static level platforms and obstacles when level changes
  useEffect(() => {
    const world = worldRef.current;
    if (!world || !initialized) return;

    // Remove old platform colliders
    for (const collider of platformCollidersRef.current) {
      world.removeCollider(collider, false);
    }
    platformCollidersRef.current = [];

    // Create current level platforms
    for (const p of level.platforms) {
      const halfExtents = [p.dimensions[0] / 2, p.dimensions[1] / 2, p.dimensions[2] / 2];
      const collider = world.createCollider(
        RAPIER.ColliderDesc.cuboid(halfExtents[0], halfExtents[1], halfExtents[2])
          .setTranslation(p.position[0], p.position[1], p.position[2])
          .setFriction(0.4)
          .setRestitution(0.2)
      );
      platformCollidersRef.current.push(collider);
    }

    // Create current level obstacles
    for (const obs of level.obstacles) {
      const halfExtents = [obs.dimensions[0] / 2, obs.dimensions[1] / 2, obs.dimensions[2] / 2];
      const collider = world.createCollider(
        RAPIER.ColliderDesc.cuboid(halfExtents[0], halfExtents[1], halfExtents[2])
          .setTranslation(obs.position[0], obs.position[1], obs.position[2])
          .setFriction(0.4)
          .setRestitution(0.2)
      );
      platformCollidersRef.current.push(collider);
    }

    // Reset marble to spawn
    const marbleBody = marbleBodyRef.current;
    if (marbleBody) {
      marbleBody.setTranslation({ x: level.spawnPosition[0], y: level.spawnPosition[1], z: level.spawnPosition[2] }, true);
      marbleBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      marbleBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
      marbleBody.sleep();
    }

    // Reset target ink in drawingStore
    useDrawingStore.getState().setTargetInk(level.targetInk);
  }, [currentLevelId, initialized, level]);

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
    sound.playGravityShift();
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
      marbleBody.setTranslation({ x: level.spawnPosition[0], y: level.spawnPosition[1], z: level.spawnPosition[2] }, true);
      marbleBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      marbleBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
      marbleBody.sleep();
      dwellTimerRef.current = 0;
    } else if (status === 'RUNNING') {
      marbleBody.wakeUp();
      sound.playReleaseSound();
    }
  }, [status, level]);

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
      world.step();

      // Check win condition (Dwell in target pocket)
      const pos = marbleBody.translation();
      const linvel = marbleBody.linvel();
      const speed = Math.sqrt(linvel.x * linvel.x + linvel.y * linvel.y);
      const dx = pos.x - level.targetPosition[0];
      const dy = pos.y - level.targetPosition[1];
      const distToTarget = Math.sqrt(dx * dx + dy * dy);

      if (distToTarget < 1.0 && speed < 1.2) {
        dwellTimerRef.current += delta;
        if (dwellTimerRef.current >= 0.5) {
          // Calculate star rating
          const totalInk = useDrawingStore.getState().totalInkUsed;
          let stars = 1;
          if (totalInk <= level.targetInk) {
            stars = 3;
          } else if (totalInk <= level.targetInk * 1.6) {
            stars = 2;
          }
          useGameStore.getState().setStarsEarned(stars);
          useGameStore.getState().setStatus('WON');
          useSaveStore.getState().recordLevelCompletion(level.id, stars, totalInk);

          // Unlock next level
          const nextIndex = level.number;
          if (nextIndex < 3) {
            const nextLevelId = `ch1-0${nextIndex + 1}`;
            useSaveStore.getState().unlockLevel(nextLevelId);
          }

          sound.playWinChimes();
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
    <mesh ref={marbleMeshRef} position={level.spawnPosition} castShadow material={marbleMaterial}>
      <sphereGeometry args={[0.35, 32, 32]} />
    </mesh>
  );
};
