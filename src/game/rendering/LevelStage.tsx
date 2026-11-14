import { FC, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';
import { getLevelById } from '../levels/levelData';
import {
  platformMaterial,
  backdropMaterial,
  targetRimMaterial,
  targetGlowMaterial,
} from './materials';

export const LevelStage: FC = () => {
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const level = getLevelById(currentLevelId);
  const targetRingRef = useRef<THREE.Mesh>(null);

  // Gentle target pulsation
  useFrame(({ clock }) => {
    if (targetRingRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.08;
      targetRingRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group>
      {/* Background Stage Backplate */}
      <mesh position={[0, 0, -2]} receiveShadow material={backdropMaterial}>
        <planeGeometry args={[36, 24]} />
      </mesh>

      {/* Static Level Platforms */}
      {level.platforms.map((p) => (
        <mesh
          key={p.id}
          position={p.position}
          castShadow
          receiveShadow
          material={platformMaterial}
        >
          <boxGeometry args={p.dimensions} />
        </mesh>
      ))}

      {/* Static Level Obstacles */}
      {level.obstacles.map((obs) => (
        <mesh
          key={obs.id}
          position={obs.position}
          castShadow
          receiveShadow
          material={platformMaterial}
        >
          <boxGeometry args={obs.dimensions} />
        </mesh>
      ))}

      {/* Target Goal Pocket */}
      <group position={level.targetPosition}>
        {/* Outer Rim */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={targetRimMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
        </mesh>

        {/* Pulsing Emerald Glow */}
        <mesh
          ref={targetRingRef}
          position={[0, 0.12, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={targetGlowMaterial}
        >
          <circleGeometry args={[0.9, 32]} />
        </mesh>
      </group>
    </group>
  );
};
