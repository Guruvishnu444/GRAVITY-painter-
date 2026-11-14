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

- [ ] **Phase 03: Visual Design & Design System**
  - Define color tokens, neumorphic drop shadows, typography, and button states.
  - Finalize HUD layout specs, 3D studio lighting rig, and shader materials.
  - Deliverable: Approved Visual Design System.

- [ ] **Phase 04: Project Foundation**
  - Initialize Vite + React + TypeScript + Tailwind CSS.
  - Strict TypeScript configuration, linting, error boundaries, and Zustand store foundations.
  - Verification: Clean build, zero type errors, dev server runs.

- [ ] **Phase 05: 3D Environment & Scene Graph**
  - Three.js canvas setup with React Three Fiber & Drei.
  - Soft isometric camera rig, soft pastel studio lighting, contact shadows, responsive viewport.
  - Verification: Interactive test scene with responsive resize and 60 FPS baseline.

- [ ] **Phase 06: Drawing Engine**
  - 2.5D plane pointer raycasting (touch + mouse).
  - Catmull-Rom spline interpolation and dynamic ribbon mesh generation.
  - Stroke preview, undo/redo, erase, and stroke length measurement.
  - Verification: Visually smooth drawing with real-time editing.

- [ ] **Phase 07: Physics & Gravity Integration**
  - Rapier3D world initialization with fixed-step simulation loop.
  - Generate compound capsule/convex colliders from drawn splines.
  - Implement marble physics, continuous collision detection (CCD), and 4-way gravity vector lerp.
  - Verification: Marble rolls smoothly along drawn paths; responds accurately to gravity shifts.

- [ ] **Phase 08: First Playable Level**
  - Spawn gate, marble, obstacles, and goal pocket with dwell timer ($0.5\text{s}$).
  - Play / Pause / Reset cycle and win condition detection.
  - Verification: Complete, playable Level 1 puzzle.

- [ ] **Phase 09: Interface Integration & Polish**
  - Floating Island HUD, Gravity Compass dial, tool dock, victory modal, pause overlay.
  - Full keyboard shortcuts (`WASD`, `Ctrl+Z`, `Space` for play/pause).
  - Verification: All UI elements functional without interfering with drawing canvas.

- [ ] **Phase 10: Levels & Progression**
  - Data-driven level loader with 3-star rating calculation.
  - IndexedDB persistence for level unlocking and star records.
  - Chapter selection grid.
  - Verification: Progress persists across page refreshes.

- [ ] **Phase 11: Audio & Micro-Interactions**
  - Howler.js / Web Audio ambient soundtrack and synthesized drawing/collision chimes.
  - Goal particle bloom and subtle camera micro-tilts on gravity shift.
  - Verification: Complete, delightful audiovisual feedback.

- [ ] **Phase 12: QA, Optimization & Mobile Polish**
  - Touch-action tuning, mobile responsive testing, and performance profiling.
  - Automated tests via Vitest.
  - Verification: QA report with verified 60 FPS performance.

- [ ] **Phase 13: Production Deployment**
  - Production build optimization and deployment instructions.
  - Verification: Zero console errors, deployment-ready bundle.
