import { create } from 'zustand';

export type GameStatus = 'READY' | 'RUNNING' | 'PAUSED' | 'WON' | 'FAILED';
export type GravityDirection = 'down' | 'up' | 'left' | 'right';

export interface GameState {
  status: GameStatus;
  currentLevelId: string;
  gravityDirection: GravityDirection;
  targetGravityDirection: GravityDirection;
  starsEarned: number;
  timeElapsed: number;

  // Actions
  setStatus: (status: GameStatus) => void;
  setLevel: (levelId: string) => void;
  setGravityDirection: (direction: GravityDirection) => void;
  setStarsEarned: (stars: number) => void;
  resetGame: () => void;
  playGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  status: 'READY',
  currentLevelId: 'ch1-01',
  gravityDirection: 'down',
  targetGravityDirection: 'down',
  starsEarned: 0,
  timeElapsed: 0,

  setStatus: (status) => set({ status }),
  setLevel: (levelId) => set({ currentLevelId: levelId, status: 'READY', starsEarned: 0, timeElapsed: 0 }),
  setGravityDirection: (direction) => set({ gravityDirection: direction, targetGravityDirection: direction }),
  setStarsEarned: (stars) => set({ starsEarned: stars }),
  resetGame: () => set({ status: 'READY', gravityDirection: 'down', targetGravityDirection: 'down' }),
  playGame: () => set({ status: 'RUNNING' }),
}));
