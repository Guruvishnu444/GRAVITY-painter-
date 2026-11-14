import { FC, useState, useRef, useCallback } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useDrawingStore, StrokePoint, StrokeData } from '../../stores/drawingStore';
import { smoothStrokePoints, calculateStrokeLength } from './spline';
import { staticStrokeMaterial, dynamicStrokeMaterial } from '../rendering/materials';
import { sound } from '../../systems/audio/audioManager';

export const DrawingSurface: FC = () => {
  const { currentBrush, addStroke, removeStroke, strokes } = useDrawingStore();
  const [activePoints, setActivePoints] = useState<StrokePoint[]>([]);
  const isDrawingRef = useRef(false);

  // Check if pointer is near an existing stroke for eraser tool
  const checkErase = useCallback((worldPoint: THREE.Vector3) => {
    const eraseRadiusSq = 0.8 * 0.8;
    for (const stroke of strokes) {
      for (const pt of stroke.points) {
        const dx = pt.x - worldPoint.x;
        const dy = pt.y - worldPoint.y;
        if (dx * dx + dy * dy < eraseRadiusSq) {
          removeStroke(stroke.id);
          return;
        }
      }
    }
  }, [strokes, removeStroke]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const point = e.point;

    if (currentBrush === 'eraser') {
      checkErase(point);
      isDrawingRef.current = true;
      return;
    }

    isDrawingRef.current = true;
    setActivePoints([{ x: point.x, y: point.y, z: 0 }]);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDrawingRef.current) return;
    e.stopPropagation();
    const point = e.point;

    if (currentBrush === 'eraser') {
      checkErase(point);
      return;
    }

    setActivePoints((prev) => {
      if (prev.length === 0) return [{ x: point.x, y: point.y, z: 0 }];
      const last = prev[prev.length - 1];
      const dx = point.x - last.x;
      const dy = point.y - last.y;
      if (dx * dx + dy * dy >= 0.04) { // min distance squared ~0.2 units
        return [...prev, { x: point.x, y: point.y, z: 0 }];
      }
      return prev;
    });
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDrawingRef.current) return;
    e.stopPropagation();
    isDrawingRef.current = false;

    if (currentBrush === 'eraser') {
      setActivePoints([]);
      return;
    }

    if (activePoints.length >= 2) {
      const smoothed = smoothStrokePoints(activePoints);
      const length = calculateStrokeLength(smoothed);

      if (length >= 0.5) {
        const newStroke: StrokeData = {
          id: `stroke-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          mode: currentBrush === 'dynamic' ? 'dynamic' : 'static',
          points: smoothed,
          length,
        };
        addStroke(newStroke);
        sound.playDrawChime(strokes.length);
      }
    }

    setActivePoints([]);
  };

  // Real-time preview line geometry
  const previewLine = activePoints.length >= 2
    ? new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(activePoints.map((p) => new THREE.Vector3(p.x, p.y, 0.05))),
        currentBrush === 'dynamic' ? dynamicStrokeMaterial : staticStrokeMaterial
      )
    : null;

  return (
    <group>
      {/* Invisible 2.5D Raycasting Target Plane at Z = 0 */}
      <mesh
        position={[0, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <planeGeometry args={[36, 24]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Real-time Stroke Preview */}
      {previewLine && <primitive object={previewLine} />}
    </group>
  );
};
