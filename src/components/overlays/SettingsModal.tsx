import { FC } from 'react';
import { useSaveStore } from '../../stores/saveStore';
import { X, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { soundEnabled, setSoundEnabled, volume, setVolume } = useSaveStore();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <h2 className="text-lg font-bold text-marble-slate">Audio & Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Toggles */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Sound Effects</span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl transition-all ${
                soundEnabled ? 'bg-ink-static text-white' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
              <span>Master Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-ink-static cursor-pointer"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <span>Platform</span>
            <span className="font-medium text-gray-700">Web 3D / Rapier</span>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all level completion and star progress?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="mt-2 py-2.5 px-4 bg-red-50 text-red-600 rounded-xl font-medium text-xs hover:bg-red-100 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
