import { create } from 'zustand';

export type BrushMode = 'static' | 'dynamic' | 'eraser';

export interface StrokePoint {
  x: number;
  y: number;
  z: number;
}

export interface StrokeData {
  id: string;
  mode: 'static' | 'dynamic';
  points: StrokePoint[];
  length: number;
}

export interface DrawingState {
  currentBrush: BrushMode;
  strokes: StrokeData[];
  undoStack: StrokeData[][];
  redoStack: StrokeData[][];
  totalInkUsed: number;
  targetInk: number;

  // Actions
  setBrush: (brush: BrushMode) => void;
  addStroke: (stroke: StrokeData) => void;
  removeStroke: (strokeId: string) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  setTargetInk: (target: number) => void;
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  currentBrush: 'static',
  strokes: [],
  undoStack: [],
  redoStack: [],
  totalInkUsed: 0,
  targetInk: 12.0,

  setBrush: (brush) => set({ currentBrush: brush }),

  addStroke: (stroke) => {
    const { strokes, undoStack, totalInkUsed } = get();
    set({
      undoStack: [...undoStack, strokes],
      redoStack: [], // new action clears redo
      strokes: [...strokes, stroke],
      totalInkUsed: totalInkUsed + stroke.length,
    });
  },

  removeStroke: (strokeId) => {
    const { strokes, undoStack } = get();
    const updated = strokes.filter((s) => s.id !== strokeId);
    const newTotal = updated.reduce((sum, s) => sum + s.length, 0);
    set({
      undoStack: [...undoStack, strokes],
      redoStack: [],
      strokes: updated,
      totalInkUsed: newTotal,
    });
  },

  undo: () => {
    const { strokes, undoStack, redoStack } = get();
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, -1);
    const newTotal = previous.reduce((sum, s) => sum + s.length, 0);

    set({
      undoStack: newUndo,
      redoStack: [...redoStack, strokes],
      strokes: previous,
      totalInkUsed: newTotal,
    });
  },

  redo: () => {
    const { strokes, undoStack, redoStack } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);
    const newTotal = next.reduce((sum, s) => sum + s.length, 0);

    set({
      undoStack: [...undoStack, strokes],
      redoStack: newRedo,
      strokes: next,
      totalInkUsed: newTotal,
    });
  },

  clearCanvas: () => {
    const { strokes, undoStack } = get();
    if (strokes.length === 0) return;
    set({
      undoStack: [...undoStack, strokes],
      redoStack: [],
      strokes: [],
      totalInkUsed: 0,
    });
  },

  setTargetInk: (target) => set({ targetInk: target }),
}));
