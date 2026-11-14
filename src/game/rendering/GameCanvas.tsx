import { FC, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { StudioLighting } from './StudioLighting';
import { LevelStage } from './LevelStage';
import { DrawingSurface } from '../drawing/DrawingSurface';
import { StrokesRenderer } from '../drawing/StrokesRenderer';
import { useGameStore, GravityDirection } from '../../stores/gameStore';

const CameraRig: FC = () => {
  const gravityDirection = useGameStore((state) => state.gravityDirection);
  const targetRotation = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0));

  useFrame(({ camera }) => {
    // Subtle, organic micro-tilt towards current gravity vector (max 1.5 degrees = ~0.026 rad)
    let roll = 0;
    let pitch = 0;

    switch (gravityDirection as GravityDirection) {
      case 'left':
        roll = 0.025;
        break;
      case 'right':
        roll = -0.025;
        break;
      case 'up':
        pitch = 0.02;
        break;
      case 'down':
      default:
        pitch = -0.02;
        break;
    }

    targetRotation.current.set(pitch, 0, roll);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotation.current.x, 0.05);
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, targetRotation.current.z, 0.05);
  });

  return null;
};

export const GameCanvas: FC = () => {
  return (
    <div className="w-full h-full relative overflow-hidden rounded-3xl select-none">
      <Canvas
        orthographic
        camera={{
          position: [0, 0, 25],
          zoom: 36,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        shadows
        className="w-full h-full touch-none"
      >
        <CameraRig />
        <StudioLighting />
        <LevelStage />
        <StrokesRenderer />
        <DrawingSurface />

        {/* Soft Ground Contact Shadow */}
        <ContactShadows
          position={[0, -6, -0.5]}
          opacity={0.4}
          scale={30}
          blur={1.8}
          far={10}
        />
      </Canvas>
    </div>
  );
};
export default GameCanvas;
