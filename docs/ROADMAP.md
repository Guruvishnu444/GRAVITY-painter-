# Staged Development Roadmap — GRAVITY PAINTER

This roadmap strictly governs the execution stages of GRAVITY PAINTER. Each stage is gated: implementation begins only after explicit review and approval of the preceding milestone.

---

## Stage Checklist

- [x] **Phase 01: Product Discovery**
  - Confirmed: 18 core product, gameplay, physics, and architecture decisions.
  - Deliverable: Approved Product Brief.

- [x] **Phase 02: Game Design & Architecture Documentation**
  - Created: `PRD.md`, `GAME-DESIGN.md`, `ARCHITECTURE.md`, `PHYSICS-SPEC.md`, `LEVEL-DESIGN.md`, `ROADMAP.md`.
  - Deliverable: Full documentation suite approved by user.

- [x] **Phase 03: Visual Design & Design System**
  - Defined color tokens, neumorphic drop shadows, typography, and button states.
  - Finalized HUD layout specs, 3D studio lighting rig, and PBR shader materials.
  - Deliverable: Approved Visual Design System (`docs/VISUAL-DESIGN.md`).

- [x] **Phase 04: Project Foundation**
  - Initialized Vite + React 18 + TypeScript + Tailwind CSS.
  - Strict TypeScript configuration, error boundaries, and Zustand store foundations.
  - Verification: Clean build, zero type errors, dev server verified.

- [x] **Phase 05: 3D Environment & Scene Graph**
  - Three.js canvas setup with React Three Fiber & Drei.
  - 2.5D orthographic camera rig with micro-tilt, soft pastel studio lighting, contact shadows.
  - Verification: Interactive 3D test scene with responsive resize and 60 FPS baseline.

- [x] **Phase 06: Drawing Engine**
  - 2.5D plane pointer raycasting (touch + mouse).
  - Catmull-Rom spline interpolation and dynamic 3D ribbon mesh generation.
  - Stroke preview, undo/redo, eraser tool, and stroke length measurement.
  - Verification: Visually smooth drawing with real-time editing.

- [x] **Phase 07: Physics & Gravity Integration**
  - Rapier3D world initialization with fixed-step simulation loop.
  - Generated compound capsule colliders from drawn splines with locked 2.5D planar degrees of freedom.
  - Implemented continuous collision detection (CCD) and 4-way gravity vector lerp.
  - Verification: Marble rolls smoothly along drawn paths; responds accurately to gravity shifts.

- [x] **Phase 08: First Playable Level**
  - Spawn gate, marble, obstacles, and goal pocket with dwell timer ($0.5\text{s}$).
  - Play / Release / Reset cycle and win condition detection.
  - Verification: Complete, playable Level 1 puzzle.

- [x] **Phase 09: Interface Integration & Polish**
  - Floating Island HUD, 4-way Gravity Compass dial, tool dock, victory modal, level select, audio settings.
  - Full keyboard shortcuts (`WASD`, `Ctrl+Z`, `Space` for play/pause, `1`/`2`/`3` for brushes).
  - Verification: All UI elements functional without interfering with drawing canvas.

- [x] **Phase 10: Levels & Progression**
  - Data-driven level definitions for Chapter 1 (Levels 1 to 3: *The Gentle Slope*, *The Chasm Leap*, *Inverted Horizon*).
  - 3-star rating calculation based on ink efficiency.
  - Progression store tracking unlocked levels and best scores.
  - Verification: Chapter 1 puzzles fully playable with unlocking progression.

- [x] **Phase 11: Audio & Micro-Interactions**
  - Web Audio API procedural sound synthesizer (harmonic chime on draw, marble release woosh, victory arpeggios, gravity shift sweeps).
  - Goal pulsation and camera micro-tilts on gravity shifts.
  - Verification: Audiovisual feedback with zero external audio assets required.

- [x] **Phase 12: QA, Optimization & Mobile Polish**
  - 17 automated unit tests across 5 test suites (`vitest run`).
  - Viewport touch protection (`touch-action: none`, `user-scalable=no`).
  - Verification: 100% test pass rate, 0 type errors.

- [x] **Phase 13: Production Deployment**
  - Production build verification (`npm run build`).
  - Standalone single-page distribution in `dist/`.
  - Verification: Ready for immediate preview and static hosting.
