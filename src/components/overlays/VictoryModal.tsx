import { FC } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useDrawingStore } from '../../stores/drawingStore';
import { getLevelById } from '../../game/levels/levelData';
import { RotateCcw, ArrowRight, Grid, Award } from 'lucide-react';

interface VictoryModalProps {
  onOpenLevelSelect: () => void;
}

export const VictoryModal: FC<VictoryModalProps> = ({ onOpenLevelSelect }) => {
  const { status, currentLevelId, setLevel, starsEarned, resetGame } = useGameStore();
  const { totalInkUsed, clearCanvas } = useDrawingStore();

  if (status !== 'WON') return null;

  const currentLevel = getLevelById(currentLevelId);
  const nextNumber = currentLevel.number + 1;
  const nextLevelId = nextNumber <= 3 ? `ch1-0${nextNumber}` : null;

  const handleNext = () => {
    if (nextLevelId) {
      clearCanvas();
      setLevel(nextLevelId);
    } else {
      onOpenLevelSelect();
    }
  };

  const handleReplay = () => {
    resetGame();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100 flex flex-col items-center">
        {/* Celebration Trophy Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-star-gold to-amber-300 text-white flex items-center justify-center shadow-lg mb-4">
          <Award className="w-9 h-9" />
        </div>

        <h2 className="text-xl font-extrabold text-marble-slate">Level Complete!</h2>
        <p className="text-xs text-gray-500 mb-4">{currentLevel.title}</p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 mb-6 text-3xl">
          {[1, 2, 3].map((starIndex) => (
            <span
              key={starIndex}
              className={`transition-all duration-300 ${
                starIndex <= starsEarned ? 'text-star-gold scale-110 drop-shadow-md' : 'text-gray-200'
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Stats Card */}
        <div className="w-full bg-gray-50 rounded-2xl p-4 mb-6 flex justify-around text-xs">
          <div>
            <span className="block text-gray-400 font-medium">Ink Used</span>
            <span className="text-base font-bold text-marble-slate">{totalInkUsed.toFixed(1)}</span>
          </div>
          <div className="w-[1px] bg-gray-200" />
          <div>
            <span className="block text-gray-400 font-medium">Target Ink</span>
            <span className="text-base font-bold text-target-mint">{currentLevel.targetInk.toFixed(1)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-2.5">
          {nextLevelId ? (
            <button
              onClick={handleNext}
              className="w-full py-3 px-4 bg-gradient-to-r from-target-mint to-emerald-500 text-white rounded-xl font-bold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenLevelSelect}
              className="w-full py-3 px-4 bg-gradient-to-r from-ink-static to-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Grid className="w-4 h-4" />
              <span>Chapter Complete! All Levels</span>
            </button>
          )}

          <div className="flex gap-2 w-full">
            <button
              onClick={handleReplay}
              className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>

            <button
              onClick={onOpenLevelSelect}
              className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Levels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
