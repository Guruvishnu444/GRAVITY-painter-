# Game Design Document (GDD) — GRAVITY PAINTER

## 1. Game Overview
* **Title:** GRAVITY PAINTER
* **Tagline:** Paint the path. Command gravity. Master physics.
* **Core Genre:** 3D Physics Zen Puzzle Game
* **Visual Style:** Pastel Neumorphism & Soft PBR Clay / Studio Aesthetics

---

## 2. Core Mechanics

### 2.1 The Marble (Player Subject)
* **Mass:** $1.0\text{ kg}$
* **Radius:** $0.35\text{ units}$
* **Restitution (Bounciness):** $0.25$ (damped, ceramic marble feel)
* **Friction:** $0.4$ (clean rolling, minimal slippage)
* **Linear & Angular Damping:** $0.1$ and $0.2$ respectively
* **Spawn Gate:** Holds the marble stationary at level start. Clicking "Release / Play" retracts the gate and activates the marble's dynamic physics.

### 2.2 The Target (Goal Pocket)
* **Shape:** Soft circular pocket with a luminous pastel aura and receiving trigger volume.
* **Win Condition:** Marble center enters the trigger volume and remains below a velocity threshold ($v < 0.8\text{ units/s}$) for $\ge 0.5\text{ continuous seconds}$.
* **Celebration Feedback:** Luminous particle bloom, target chime chime ring, and level victory modal appearance.

### 2.3 Drawing & Geometry
* **Interaction Surface:** A calibrated $Z = 0$ vertical 2D interaction slice within a 3D environment.
* **Stroke Lifecycle:**
  1. *PointerDown:* Captures initial raycast point on the $Z = 0$ plane.
  2. *PointerMove:* Records timestamped points if distance from last point exceeds sampling threshold ($0.1\text{ units}$).
  3. *Real-time Preview:* Catmull-Rom spline rendered as an uncommitted ribbon mesh.
  4. *PointerUp:* Finalizes stroke. Generates:
     - Visual Mesh: Rounded 3D extruded ribbon with capsule endcaps.
     - Rapier Physics: A chain of connected capsule colliders or compound convex polygons strictly mapped to the smoothed spline.
* **Static vs. Dynamic:**
  - *Static Strokes:* Anchored rigidly in world space (`RigidBodyType.Fixed`).
  - *Dynamic Strokes:* Spawned as movable rigid bodies (`RigidBodyType.Dynamic`) with mass proportional to stroke length, affected by gravity.

### 2.4 Gravity Control
* **Four States:**
  - $\downarrow$ Down: $[0, -9.81, 0]$ (Default)
  - $\uparrow$ Up: $[0, 9.81, 0]$
  - $\leftarrow$ Left: $[-9.81, 0, 0]$
  - $\rightarrow$ Right: $[9.81, 0, 0]$
* **Input Triggers:**
  - On-screen floating Gravity Compass dial (4 cardinal buttons).
  - Keyboard shortcuts: `W` / `ArrowUp`, `S` / `ArrowDown`, `A` / `ArrowLeft`, `D` / `ArrowRight`.
  - Directional touch flick/swipe gestures.
* **Transition Physics:** Over a $0.35\text{s}$ duration, the Rapier gravity vector smoothly transitions to the target vector using spherical interpolation, curving the marble's flight naturally.

---

## 3. Level Progression & Scoring

### 3.1 Star Rating Formula
Each level defines an **Optimal Ink Threshold ($I_{\text{target}}$)** in world units:
* **3 Stars:** Total Ink Drawn $\le I_{\text{target}}$
* **2 Stars:** Total Ink Drawn $\le 1.6 \times I_{\text{target}}$
* **1 Star:** Level successfully completed (any ink length)

### 3.2 Chapter Arc
* **Chapter 1: Foundations (Levels 1–5):**
  - Teaching static drawing, slopes, funnels, and momentum conservation.
* **Chapter 2: Vector Shifts (Levels 6–10):**
  - Introduces 4-way gravity changes to navigate vertical shafts, loops, and ceiling targets.
* **Chapter 3: Dynamic Balances (Levels 11–15):**
  - Introduces the Dynamic Brush: drawing counterweights, falling blocks to trigger switches, and mobile levers.
* **Chapter 4: Master Puzzles (Levels 16–20):**
  - Multi-stage gravity transitions, moving hazards, and tight ink budgets.

---

## 4. User Interface Flow
```
[Title / Splash Screen]
         │
         ├───► [Level Selection Grid (Chapters 1–4)] ───► [Gameplay Canvas (HUD)]
         │                                                      │
         ├───► [Sandbox Playground] ◄───────────────────────────┤ (Pause / Win / Restart)
         │                                                      │
         └───► [Settings Modal (Audio, Controls, Clear Data)] ──┘
```

### 4.1 In-Game HUD Elements
* **Top Bar:** Level Title & Chapter, 3-Star Ink Gauge, Pause/Menu button.
* **Bottom Tool Dock:**
  - Static Brush (Active by default)
  - Dynamic Brush
  - Eraser Tool
  - Undo (`Ctrl+Z`) / Redo (`Ctrl+Y`)
  - Clear All Strokes
* **Bottom-Left Control:** Play (Release Marble) / Reset Marble
* **Bottom-Right Control:** 4-Way Gravity Compass Dial
