import { FC, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  marbleMaterial,
  platformMaterial,
  backdropMaterial,
  targetRimMaterial,
  targetGlowMaterial,
} from './materials';

interface LevelStageProps {
  marblePosition?: [number, number, number];
}

export const LevelStage: FC<LevelStageProps> = ({
  marblePosition = [-8, 4.0, 0],
}) => {
  const targetRingRef = useRef<THREE.Mesh>(null);

  // Subtle pulsing animation for the target goal aura
  useFrame(({ clock }) => {
    if (targetRingRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.08;
      targetRingRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group>
      {/* Background Backplate */}
      <mesh position={[0, 0, -2]} receiveShadow material={backdropMaterial}>
        <planeGeometry args={[36, 24]} />
      </mesh>

      {/* Starting Platform (Elevated Left) */}
      <mesh position={[-7.5, 3.25, 0]} castShadow receiveShadow material={platformMaterial}>
        <boxGeometry args={[5, 0.5, 2]} />
      </mesh>

      {/* Starting Spawn Safety Backing */}
      <mesh position={[-10.1, 4.25, 0]} castShadow receiveShadow material={platformMaterial}>
        <boxGeometry args={[0.4, 2, 2]} />
      </mesh>

      {/* Target Goal Platform (Lower Right) */}
      <mesh position={[6, -3.25, 0]} castShadow receiveShadow material={platformMaterial}>
        <boxGeometry args={[6, 0.5, 2]} />
      </mesh>

      {/* Target Goal Pocket Ring & Glow */}
      <group position={[6, -2.8, 0]}>
        {/* Outer Cylinder Rim */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={targetRimMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
        </mesh>

        {/* Pulsing Mint Center Aura */}
        <mesh
          ref={targetRingRef}
          position={[0, 0.12, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={targetGlowMaterial}
        >
          <circleGeometry args={[0.9, 32]} />
        </mesh>
      </group>

      {/* Visual Marble (Placeholder / Initial Spawn) */}
      <mesh position={marblePosition} castShadow material={marbleMaterial}>
        <sphereGeometry args={[0.35, 32, 32]} />
      </mesh>
    </group>
  );
};
