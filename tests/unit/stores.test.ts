import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/stores/gameStore';
import { useDrawingStore, StrokeData } from '../../src/stores/drawingStore';
import { useSaveStore } from '../../src/stores/saveStore';

describe('Game Store State Machine', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('initializes in READY status with down gravity', () => {
    const state = useGameStore.getState();
    expect(state.status).toBe('READY');
    expect(state.gravityDirection).toBe('down');
  });

  it('transitions from READY to RUNNING on playGame', () => {
    useGameStore.getState().playGame();
    expect(useGameStore.getState().status).toBe('RUNNING');
  });

  it('updates gravity direction correctly', () => {
    useGameStore.getState().setGravityDirection('left');
    expect(useGameStore.getState().gravityDirection).toBe('left');
  });
});

describe('Drawing Store & Undo/Redo Engine', () => {
  beforeEach(() => {
    useDrawingStore.getState().clearCanvas();
  });

  const mockStroke: StrokeData = {
    id: 'stroke-1',
    mode: 'static',
    points: [{ x: 0, y: 0, z: 0 }, { x: 5, y: 0, z: 0 }],
    length: 5.0,
  };

  it('adds stroke and calculates total ink length', () => {
    useDrawingStore.getState().addStroke(mockStroke);
    const state = useDrawingStore.getState();
    expect(state.strokes.length).toBe(1);
    expect(state.totalInkUsed).toBe(5.0);
  });

  it('handles undo and redo seamlessly', () => {
    useDrawingStore.getState().addStroke(mockStroke);
    expect(useDrawingStore.getState().strokes.length).toBe(1);

    // Undo
    useDrawingStore.getState().undo();
    expect(useDrawingStore.getState().strokes.length).toBe(0);
    expect(useDrawingStore.getState().totalInkUsed).toBe(0);

    // Redo
    useDrawingStore.getState().redo();
    expect(useDrawingStore.getState().strokes.length).toBe(1);
    expect(useDrawingStore.getState().totalInkUsed).toBe(5.0);
  });
});

describe('Save Store & Progression Persistence', () => {
  it('records level completion and star calculations', () => {
    useSaveStore.getState().recordLevelCompletion('ch1-01', 3, 8.5);
    const progress = useSaveStore.getState().progress['ch1-01'];
    expect(progress.completed).toBe(true);
    expect(progress.stars).toBe(3);
    expect(progress.bestInk).toBe(8.5);
  });
});
