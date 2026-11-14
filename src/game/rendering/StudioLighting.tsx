import { FC } from 'react';

export const StudioLighting: FC = () => {
  return (
    <>
      {/* Soft Ambient Skylight */}
      <ambientLight color="#F8FAFC" intensity={0.7} />

      {/* Main Studio Key Directional Light with Shadows */}
      <directionalLight
        position={[10, 15, 20]}
        intensity={1.2}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />

      {/* Warm Fill Light to soften contrasts */}
      <directionalLight
        position={[-12, -10, 15]}
        intensity={0.35}
        color="#FFEFE0"
      />
    </>
  );
};
