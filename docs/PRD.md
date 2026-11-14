# Product Requirements Document (PRD) — GRAVITY PAINTER

## 1. Executive Summary
**GRAVITY PAINTER** is a premium browser-based 3D physics puzzle game. Players draw physical paths and structures on a calibrated 2.5D plane, manipulate orthogonal gravity vectors, and guide rolling marbles toward targets. Designed as a meditative, minimalist Zen puzzler, it blends tactile creative expression with deterministic, responsive physics simulation.

---

## 2. Product Vision & Target Audience
* **Genre:** 3D Physics-based Zen Puzzle Game.
* **Core Philosophy:** Low frustration, high tactile delight. Freedom to experiment without punishing timers or instant death.
* **Target Audience:** Puzzle fans, creative builders, and casual-to-midcore web players (desktop, tablet, and mobile).
* **Key Pillars:**
  1. *Immediate Tactile Joy:* Fluid, beautiful drawing with zero lag and organic smoothing.
  2. *Predictable & Rewarding Physics:* Reliable Rapier simulation where structures behave intuitively.
  3. *Zen Minimalism:* Clean pastel neumorphic visual aesthetic, ambient generative audio, and unhurried pacing.
  4. *Frictionless Accessibility:* Zero-install web game, runs at 60+ FPS across modern browsers, 100% offline-ready.

---

## 3. Scope & Feature Requirements

### 3.1 Core Gameplay Loop
1. **Inspect Level:** Assess the starting ball cradle, obstacles, goal pocket, and spatial layout.
2. **Pre-Planning Drawing:** Draw paths, ramps, guides, or counterweights using hand-drawn strokes.
3. **Release & Simulate:** Release the marble into real-time Rapier physics simulation.
4. **Dynamic Intervention:** Shift 4-way gravity on the fly or draw reactive mid-air strokes as needed.
5. **Goal Dwell:** Marble safely enters the target pocket and settles for $\ge 0.5\text{s}$.
6. **Victory & Scoring:** Level completion recorded with an ink efficiency rating (1 to 3 stars).

### 3.2 Game Modes
* **Campaign Mode:** Linear progression through thematic chapters:
  * *Chapter 1: The First Stroke* (Basic static ramps, ball rolling, targets).
  * *Chapter 2: Shifting Fields* (4-way gravity manipulation, inverted climbs).
  * *Chapter 3: Dynamic Forms* (Dynamic falling weights, seesaws, balance scales).
  * *Chapter 4: Spatial Harmonics* (Complex obstacles, momentum redirection, precise ink budgeting).
* **Sandbox Playground:** Free-form physics laboratory:
  * Infinite canvas with customizable gravity.
  * Multi-marble spawner.
  * Full access to static and dynamic brushes.
  * One-tap canvas clearing.
  * URL hash export/import for sharing contraptions without an external database.

### 3.3 Drawing System
* **Perspective:** Fixed 2.5D drawing plane embedded in an atmospheric 3D isometric/orthographic scene.
* **Brush Modes:**
  * **Static Brush (Default):** Draws immovably anchored physical geometry (ramps, funnels, walls).
  * **Dynamic Brush (Advanced):** Draws free-floating rigid bodies endowed with mass and gravity (weights, levers).
  * **Eraser:** Click/tap or drag over existing strokes to remove them.
  * **Undo / Redo:** Full action stack for non-destructive puzzle editing.
* **Ink Mechanics:** Unlimited drawing during puzzles. Ink length is measured purely for the optional 3-Star Efficiency benchmark.

### 3.4 Gravity Mechanics
* **Vector Model:** 4-Way Discrete Orthogonal (Down $(0, -9.81, 0)$, Up $(0, 9.81, 0)$, Left $(-9.81, 0, 0)$, Right $(9.81, 0, 0)$).
* **Transition Feel:** Smooth 0.35s spherical/linear interpolation between gravity vectors, accompanied by subtle directional screen micro-tilts and sound cues.

### 3.5 Audio & Atmosphere
* Generative ambient tonal soundscapes (Howler.js / Web Audio API).
* Tactile harmonic chimes during stroke drawing.
* Rich ceramic resonance on marble collisions.
* Clean celebration harmonics upon level completion.
* Independent Master, Music, and SFX volume sliders with mute toggles.

### 3.6 Persistence & Platform Compatibility
* **Client-Side Persistence:** LocalStorage / IndexedDB for level unlock progress, star achievements, and user preferences.
* **Shareable Contraptions:** Compact JSON payloads compressed with LZ-String/Deflate and encoded into URL hashes (`#c=...`).
* **Platform Support:** Desktop (Chrome, Edge, Safari, Firefox) with keyboard/mouse, and Tablets/Phones (iOS Safari, Android Chrome) with multitouch rejection and pointer events.

---

## 4. Success Metrics & Acceptance Criteria
* **Performance:** Solid 60 FPS on standard desktop GPUs and modern mobile devices (iPhone 11+ / modern Android).
* **Startup Time:** First playable interactive scene renders in under 2.5 seconds on standard 4G/broadband.
* **Physics Stability:** Zero ball-tunneling through drawn geometry under standard operational speeds.
* **Responsiveness:** Zero UI gesture collision between drawing strokes and browser navigation (pinch/scroll disabled on canvas via `touch-action: none`).
