import { FC } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useDrawingStore } from '../../stores/drawingStore';
import { useSaveStore } from '../../stores/saveStore';
import { LEVELS } from '../../game/levels/levelData';
import { X, Lock, CheckCircle, Star } from 'lucide-react';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LevelSelectModal: FC<LevelSelectModalProps> = ({ isOpen, onClose }) => {
  const { currentLevelId, setLevel } = useGameStore();
  const { clearCanvas } = useDrawingStore();
  const progress = useSaveStore((state) => state.progress);

  if (!isOpen) return null;

  const handleSelect = (levelId: string) => {
    const isUnlocked = progress[levelId]?.unlocked ?? (levelId === 'ch1-01');
    if (!isUnlocked) return;

    clearCanvas();
    setLevel(levelId);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-marble-slate">Select Level</h2>
            <p className="text-xs text-gray-500">Chapter 1: The First Stroke</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level List / Cards */}
        <div className="grid grid-cols-1 gap-3 my-4">
          {LEVELS.map((level) => {
            const levelProg = progress[level.id];
            const isUnlocked = levelProg?.unlocked ?? (level.id === 'ch1-01');
            const isCurrent = level.id === currentLevelId;
            const stars = levelProg?.stars || 0;

            return (
              <button
                key={level.id}
                onClick={() => handleSelect(level.id)}
                disabled={!isUnlocked}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                  isCurrent
                    ? 'border-ink-static bg-blue-50/50 shadow-sm'
                    : isUnlocked
                    ? 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
                    : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isCurrent
                        ? 'bg-ink-static text-white'
                        : isUnlocked
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isUnlocked ? level.number : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-marble-slate">{level.title}</h3>
                    <p className="text-xs text-gray-400">{level.description.slice(0, 42)}...</p>
                  </div>
                </div>

                {/* Stars and status badge */}
                <div className="flex flex-col items-end">
                  {isUnlocked && (
                    <div className="flex items-center gap-0.5 text-xs">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= stars ? 'text-star-gold fill-current' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  {levelProg?.completed && (
                    <div className="flex items-center gap-1 text-[10px] text-target-mint font-medium mt-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Cleared</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
