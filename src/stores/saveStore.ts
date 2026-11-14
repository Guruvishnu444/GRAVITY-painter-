import { create } from 'zustand';

export interface LevelProgress {
  levelId: string;
  unlocked: boolean;
  completed: boolean;
  stars: number;
  bestInk: number | null;
}

export interface SaveState {
  progress: Record<string, LevelProgress>;
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;

  // Actions
  recordLevelCompletion: (levelId: string, stars: number, inkUsed: number) => void;
  unlockLevel: (levelId: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
}

const INITIAL_PROGRESS: Record<string, LevelProgress> = {
  'ch1-01': { levelId: 'ch1-01', unlocked: true, completed: false, stars: 0, bestInk: null },
  'ch1-02': { levelId: 'ch1-02', unlocked: false, completed: false, stars: 0, bestInk: null },
  'ch1-03': { levelId: 'ch1-03', unlocked: false, completed: false, stars: 0, bestInk: null },
};

export const useSaveStore = create<SaveState>((set, get) => ({
  progress: INITIAL_PROGRESS,
  soundEnabled: true,
  musicEnabled: true,
  volume: 0.7,

  recordLevelCompletion: (levelId, stars, inkUsed) => {
    const { progress } = get();
    const current = progress[levelId] || { levelId, unlocked: true, completed: false, stars: 0, bestInk: null };
    const bestInk = current.bestInk === null ? inkUsed : Math.min(current.bestInk, inkUsed);
    const bestStars = Math.max(current.stars, stars);

    set({
      progress: {
        ...progress,
        [levelId]: {
          ...current,
          completed: true,
          stars: bestStars,
          bestInk,
        },
      },
    });
  },

  unlockLevel: (levelId) => {
    const { progress } = get();
    set({
      progress: {
        ...progress,
        [levelId]: {
          ...(progress[levelId] || { levelId, completed: false, stars: 0, bestInk: null }),
          unlocked: true,
        },
      },
    });
  },

  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setMusicEnabled: (musicEnabled) => set({ musicEnabled }),
  setVolume: (volume) => set({ volume }),
}));
