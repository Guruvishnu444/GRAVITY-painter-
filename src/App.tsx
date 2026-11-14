import { FC, useState, useEffect } from 'react';
import { useGameStore } from './stores/gameStore';
import { useDrawingStore } from './stores/drawingStore';
import { useSaveStore } from './stores/saveStore';
import { getLevelById } from './game/levels/levelData';
import { GameCanvas } from './game/rendering/GameCanvas';
import { VictoryModal } from './components/overlays/VictoryModal';
import { LevelSelectModal } from './components/menus/LevelSelectModal';
import { SettingsModal } from './components/overlays/SettingsModal';
import {
  Play,
  RotateCcw,
  PenTool,
  Sparkles,
  Eraser,
  Undo,
  Redo,
  Settings,
  Grid,
} from 'lucide-react';

export const App: FC = () => {
  const { status, currentLevelId, gravityDirection, setGravityDirection, playGame, resetGame } = useGameStore();
  const { currentBrush, setBrush, undo, redo, clearCanvas, totalInkUsed, targetInk } = useDrawingStore();
  const progress = useSaveStore((state) => state.progress);

  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentLevel = getLevelById(currentLevelId);
  const levelProgress = progress[currentLevelId];
  const currentStars = levelProgress?.stars || 0;

  const inkPercentage = Math.min(100, Math.round((totalInkUsed / targetInk) * 100));

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (status === 'READY') playGame();
        else resetGame();
      } else if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        setGravityDirection('up');
      } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        setGravityDirection('down');
      } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        setGravityDirection('left');
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        setGravityDirection('right');
      } else if (e.code === 'Digit1') {
        setBrush('static');
      } else if (e.code === 'Digit2') {
        setBrush('dynamic');
      } else if (e.code === 'Digit3') {
        setBrush('eraser');
      } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyY') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, playGame, resetGame, setGravityDirection, setBrush, undo, redo]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3 md:p-4 bg-gradient-to-b from-zen-bg to-zen-muted overflow-hidden select-none">
      {/* Top Floating Island Header */}
      <header className="z-20 w-full max-w-4xl flex items-center justify-between px-4 md:px-6 py-2.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-neumorph">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLevelSelectOpen(true)}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-ink-static to-ink-static-light flex items-center justify-center text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
            title="Choose Level"
          >
            <Grid className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-wide text-marble-slate">{currentLevel.title}</h1>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                Level {currentLevel.number}
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block">{currentLevel.description}</p>
          </div>
        </div>

        {/* Ink & Star Gauge + Settings */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-gray-600">
              Ink: {totalInkUsed.toFixed(1)} / {targetInk.toFixed(1)}
            </span>
            <div className="w-28 sm:w-36 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-300 ${
                  inkPercentage <= 100 ? 'bg-target-mint' : inkPercentage <= 160 ? 'bg-star-gold' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min(100, inkPercentage)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center text-star-gold text-sm tracking-widest font-bold">
            {[1, 2, 3].map((s) => (
              <span key={s} className={s <= currentStars ? 'text-star-gold' : 'text-gray-300'}>
                ★
              </span>
            ))}
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
            title="Audio & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Center 3D Simulation Viewport */}
      <main className="relative flex-1 w-full max-w-5xl my-2.5 rounded-3xl bg-white/40 border border-white/60 shadow-neumorph overflow-hidden flex items-center justify-center">
        <GameCanvas />

        {/* Subtle Canvas Status Pill Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs font-medium text-gray-700 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
          <span>Status: <strong className="text-ink-static">{status}</strong></span>
          <span>•</span>
          <span>Gravity: <strong className="uppercase text-purple-600">{gravityDirection}</strong></span>
        </div>
      </main>

      {/* Bottom Floating Control Docks */}
      <footer className="z-20 w-full max-w-4xl flex items-center justify-between gap-2 md:gap-4">
        {/* Simulation Play / Reset */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1.5 md:p-2 rounded-2xl shadow-neumorph">
          {status === 'READY' ? (
            <button
              onClick={playGame}
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl bg-gradient-to-r from-target-mint to-emerald-500 text-white font-medium text-xs md:text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
              title="Release Marble (Space)"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Release Ball</span>
            </button>
          ) : (
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl bg-gray-200 text-gray-800 font-medium text-xs md:text-sm hover:bg-gray-300 active:scale-95 transition-all"
              title="Reset Simulation (Space)"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Central Drawing Tools Dock */}
        <div className="flex items-center gap-1 md:gap-1.5 bg-white/80 backdrop-blur-md p-1.5 md:p-2 rounded-2xl shadow-neumorph">
          <button
            onClick={() => setBrush('static')}
            title="Static Brush [1] - Fixed Ramps & Paths"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentBrush === 'static' ? 'bg-ink-static text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Static</span>
          </button>

          <button
            onClick={() => setBrush('dynamic')}
            title="Dynamic Brush [2] - Falling Weights & Levers"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentBrush === 'dynamic' ? 'bg-ink-dynamic text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dynamic</span>
          </button>

          <button
            onClick={() => setBrush('eraser')}
            title="Eraser [3] - Click or drag over lines to erase"
            className={`p-2 rounded-xl text-xs transition-all ${
              currentBrush === 'eraser' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Eraser className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-6 bg-gray-200 mx-0.5 md:mx-1" />

          <button
            onClick={undo}
            title="Undo (Ctrl+Z)"
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
          >
            <Undo className="w-4 h-4" />
          </button>

          <button
            onClick={redo}
            title="Redo (Ctrl+Y)"
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
          >
            <Redo className="w-4 h-4" />
          </button>

          <button
            onClick={clearCanvas}
            title="Clear All Strokes"
            className="px-2 md:px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            Clear
          </button>
        </div>

        {/* 4-Way Gravity Compass Dial */}
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md p-1 md:p-1.5 rounded-2xl shadow-neumorph">
          <button
            onClick={() => setGravityDirection('left')}
            className={`p-1.5 md:p-2 rounded-xl text-xs font-bold transition-all ${
              gravityDirection === 'left' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Gravity Left (A / Left Arrow)"
          >
            ←
          </button>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setGravityDirection('up')}
              className={`p-1 md:p-1.5 rounded-xl text-xs font-bold transition-all ${
                gravityDirection === 'up' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Gravity Up (W / Up Arrow)"
            >
              ↑
            </button>
            <button
              onClick={() => setGravityDirection('down')}
              className={`p-1 md:p-1.5 rounded-xl text-xs font-bold transition-all ${
                gravityDirection === 'down' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Gravity Down (S / Down Arrow)"
            >
              ↓
            </button>
          </div>
          <button
            onClick={() => setGravityDirection('right')}
            className={`p-1.5 md:p-2 rounded-xl text-xs font-bold transition-all ${
              gravityDirection === 'right' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Gravity Right (D / Right Arrow)"
          >
            →
          </button>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <VictoryModal onOpenLevelSelect={() => setIsLevelSelectOpen(true)} />
      <LevelSelectModal isOpen={isLevelSelectOpen} onClose={() => setIsLevelSelectOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
export default App;
