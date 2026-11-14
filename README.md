<img width="1200" height="400" alt="banner" src="https://github.com/user-attachments/assets/7ddcff59-30ce-49ad-aa5e-4eb2463a9efa" />

<div align="center">

Gravity Painter banner

🎨 GRAVITY PAINTER

Paint the path. Command gravity. Master physics.

A calm, browser-based 3D physics puzzle game. Draw ramps and structures, flip gravity in four directions, and guide a marble into its goal.

Show Image Show Image Show Image Show Image Show Image

</div>
📸 Preview
<img width="1200" height="675" alt="gameplay (1)" src="https://github.com/user-attachments/assets/49343889-fb4b-412d-ada2-d86db3bce29e" />




Gameplay preview

Level 1 – "The Gentle Slope": draw a ramp so the marble rolls into the glowing goal.

✨ Features
Free-hand drawing – strokes are smoothed with Catmull-Rom splines and turned into 3D ribbon meshes.
Real physics – powered by Rapier; every stroke becomes a chain of capsule colliders.
4-way gravity control – switch between Down, Up, Left and Right with a smooth 0.35 s transition.
Two brushes – Static (fixed ramps/walls) and Dynamic (movable weights and levers), plus an eraser.
Star rating – finish with less ink to earn up to 3 ⭐.
Procedural audio – chimes, whooshes and victory sounds generated with the Web Audio API (no audio files).
Progress saving – unlocked levels and best scores stored locally in your browser.
Touch friendly – works with mouse, keyboard and touch screens.
🎮 How to Play
Look at the level: find the marble and the goal pocket.
Draw a path with your mouse or finger.
Press Release (or Space) to drop the marble.
Change gravity mid-run if you need to.
Keep the marble in the goal for 0.5 s to win.
⌨️ Controls
Action	Keys
Release / Reset marble	Space
Gravity Up / Down / Left / Right	W S A D or Arrow keys
Static brush	1
Dynamic brush	2
Eraser	3
Undo / Redo	Ctrl + Z / Ctrl + Y (Cmd on Mac)
⭐ Scoring
Stars	Condition
⭐⭐⭐	Ink used ≤ the level's target ink
⭐⭐	Ink used ≤ 1.6 × target ink
⭐	Level completed
🚀 Getting Started

Requirements: Node.js 18 or newer.

bash
# 1. Clone the repository
git clone https://github.com/Guruvishnu444/GRAVITY-painter-.git
cd GRAVITY-painter-

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

Then open the local URL shown in your terminal (usually http://localhost:5173).

Other scripts
Command	Description
npm run build	Type-check and build for production (dist/)
npm run preview	Preview the production build
npm test	Run unit tests with Vitest
🧰 Tech Stack
UI: React 18, Tailwind CSS, Lucide icons
3D: Three.js, React Three Fiber, Drei
Physics: Rapier 3D (@dimforge/rapier3d-compat)
State: Zustand
Language / Build: TypeScript, Vite
Testing: Vitest
Hosting: Vercel (vercel.json included)
📁 Project Structure
├── docs/                  # PRD, game design, physics, level & visual design, roadmap
├── src/
│   ├── components/        # Menus, overlays (settings, victory), UI helpers
│   ├── game/
│   │   ├── drawing/       # Pointer input, splines, ribbon geometry
│   │   ├── levels/        # Data-driven level definitions
│   │   ├── physics/       # Rapier world and collider builder
│   │   └── rendering/     # Canvas, lighting, materials, level stage
│   ├── stores/            # Zustand stores (game, drawing, save)
│   ├── systems/audio/     # Procedural audio manager
│   ├── App.tsx
│   └── main.tsx
├── tests/unit/            # Vitest test suites
└── index.html
🗺️ Levels

Chapter 1 is playable now:

The Gentle Slope
The Chasm Leap
Inverted Horizon

Planned (see docs/GAME-DESIGN.md): gravity-shift puzzles, dynamic-brush puzzles, master puzzles with tight ink budgets, and a sandbox mode.

📚 Documentation

More detail lives in the docs folder: PRD · Game Design · Architecture · Physics Spec · Level Design · Visual Design · Roadmap

🤝 Contributing

Ideas and pull requests are welcome. Fork the repo, create a branch, and open a PR. Please run npm test and npm run build first.

📄 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">Made with ❤️ by <a href="https://github.com/Guruvishnu444">Guruvishnu444</a></div>
