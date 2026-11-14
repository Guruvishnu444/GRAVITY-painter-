import { FC } from 'react';
import { useGameStore } from './stores/gameStore';
import { useDrawingStore } from './stores/drawingStore';
import { Play, RotateCcw, PenTool, Sparkles, Eraser, Undo, Redo, Compass } from 'lucide-react';

export const App: FC = () => {
  const { status, gravityDirection, setGravityDirection, playGame, resetGame } = useGameStore();
  const { currentBrush, setBrush, undo, redo, clearCanvas, totalInkUsed, targetInk } = useDrawingStore();

  const inkPercentage = Math.min(100, Math.round((totalInkUsed / targetInk) * 100));

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 bg-gradient-to-b from-zen-bg to-zen-muted overflow-hidden select-none">
      {/* Top Floating Island Header */}
      <header className="z-20 w-full max-w-4xl flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-neumorph">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ink-static to-ink-static-light flex items-center justify-center text-white font-bold text-sm shadow-md">
            GP
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-marble-slate">GRAVITY PAINTER</h1>
            <p className="text-xs text-gray-500">Chapter 1: The First Stroke</p>
          </div>
        </div>

        {/* Ink & Star Gauge */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-gray-600">Ink Used: {totalInkUsed.toFixed(1)} / {targetInk.toFixed(1)}</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-300 ${
                  inkPercentage <= 100 ? 'bg-target-mint' : inkPercentage <= 160 ? 'bg-star-gold' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min(100, inkPercentage)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center text-star-gold">
            <span className="text-lg font-bold">★★★</span>
          </div>
        </div>
      </header>

      {/* Center 3D Simulation Viewport Placeholder */}
      <main className="relative flex-1 w-full max-w-5xl my-4 rounded-3xl bg-white/40 border border-white/60 shadow-neumorph flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-ink-static to-target-mint flex items-center justify-center text-white shadow-md">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-lg font-bold text-marble-slate mb-1">Foundational Shell Initialized</h2>
          <p className="text-xs text-gray-600 mb-4">
            Phase 04 foundation is verified. 3D canvas, Rapier physics world, and 2.5D drawing plane will mount here in Phase 05.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-700 bg-gray-100/80 px-3 py-1.5 rounded-full">
            <span>Simulation Status: <strong className="text-ink-static">{status}</strong></span>
            <span>•</span>
            <span>Gravity: <strong className="uppercase text-purple-600">{gravityDirection}</strong></span>
          </div>
        </div>
      </main>

      {/* Bottom Floating Control Docks */}
      <footer className="z-20 w-full max-w-4xl flex items-center justify-between gap-4">
        {/* Simulation Play / Reset */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-neumorph">
          {status === 'READY' ? (
            <button
              onClick={playGame}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-target-mint to-emerald-500 text-white font-medium text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Release Ball</span>
            </button>
          ) : (
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-200 text-gray-800 font-medium text-sm hover:bg-gray-300 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Central Drawing Tools Dock */}
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-neumorph">
          <button
            onClick={() => setBrush('static')}
            title="Static Brush (Guides & Ramps)"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentBrush === 'static' ? 'bg-ink-static text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Static</span>
          </button>

          <button
            onClick={() => setBrush('dynamic')}
            title="Dynamic Brush (Falling Weights)"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentBrush === 'dynamic' ? 'bg-ink-dynamic text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dynamic</span>
          </button>

          <button
            onClick={() => setBrush('eraser')}
            title="Eraser"
            className={`p-2 rounded-xl text-xs transition-all ${
              currentBrush === 'eraser' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Eraser className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-6 bg-gray-200 mx-1" />

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
            className="px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            Clear
          </button>
        </div>

        {/* 4-Way Gravity Compass Dial */}
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-neumorph">
          <button
            onClick={() => setGravityDirection('left')}
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              gravityDirection === 'left' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Gravity Left (A / Left)"
          >
            ←
          </button>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setGravityDirection('up')}
              className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                gravityDirection === 'up' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Gravity Up (W / Up)"
            >
              ↑
            </button>
            <button
              onClick={() => setGravityDirection('down')}
              className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                gravityDirection === 'down' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Gravity Down (S / Down)"
            >
              ↓
            </button>
          </div>
          <button
            onClick={() => setGravityDirection('right')}
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              gravityDirection === 'right' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Gravity Right (D / Right)"
          >
            →
          </button>
        </div>
      </footer>
    </div>
  );
};
export default App;
