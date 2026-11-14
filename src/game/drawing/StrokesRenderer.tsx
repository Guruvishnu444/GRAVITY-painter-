import { FC, useMemo } from 'react';
import { useDrawingStore, StrokeData } from '../../stores/drawingStore';
import { createStrokeGeometry } from './ribbonGeometry';
import { staticStrokeMaterial, dynamicStrokeMaterial } from '../rendering/materials';

const SingleStrokeMesh: FC<{ stroke: StrokeData }> = ({ stroke }) => {
  const geometry = useMemo(() => {
    return createStrokeGeometry(stroke.points, 0.16, 0.6);
  }, [stroke.points]);

  return (
    <mesh
      geometry={geometry}
      material={stroke.mode === 'dynamic' ? dynamicStrokeMaterial : staticStrokeMaterial}
      castShadow
      receiveShadow
    />
  );
};

export const StrokesRenderer: FC = () => {
  const strokes = useDrawingStore((state) => state.strokes);

  return (
    <group>
      {strokes.map((stroke) => (
        <SingleStrokeMesh key={stroke.id} stroke={stroke} />
      ))}
    </group>
  );
};
