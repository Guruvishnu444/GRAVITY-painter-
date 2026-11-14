# Technical Architecture Document — GRAVITY PAINTER

## 1. System Overview & Technology Stack
GRAVITY PAINTER is engineered around a clean separation of concerns:
* **Rendering & Scene Graph:** Three.js via React Three Fiber (`@react-three/fiber`) and Drei (`@react-three/drei`).
* **Physics Engine:** Rapier3D (`@dimforge/rapier3d-compat`). Rapier runs at a fixed $60\text{Hz}$ timestep completely outside React render loops.
* **UI & Component Layer:** React 18+ with Tailwind CSS and Framer Motion for smooth overlays and HUD transitions.
* **State Management:** Zustand stores partitioned into UI State, Game Lifecycle, Drawing State, and Settings/Progress.
* **Audio Engine:** Howler.js / Web Audio API wrapper with sound pooling and synthesized micro-chimes.
* **Persistence & Serialization:** IndexedDB via `idb-keyval` for user progress, LZ-String for URL compression.
* **Build Tooling & Testing:** Vite + TypeScript (Strict), Vitest for unit/integration tests, Playwright for E2E tests.

---

## 2. Directory Structure
```
gravity-painter/
├── docs/                      # Architectural & design specifications
├── public/                    # Audio files, icons, static assets
├── src/
│   ├── app/                   # App root, providers, error boundaries
│   ├── components/
│   │   ├── ui/                # Base UI elements (buttons, sliders, modals)
│   │   ├── hud/               # In-game HUD (tools dock, compass, star gauge)
│   │   ├── menus/             # Main menu, chapter select, level grid
│   │   └── overlays/          # Victory modal, pause menu, settings dialog
│   ├── game/
│   │   ├── core/              # Game loop orchestrator, lifecycle manager
│   │   ├── rendering/         # Three.js canvas, lighting, camera rig, materials
│   │   ├── drawing/           # Pointer raycast, spline smoothing, mesh generator
│   │   ├── physics/           # Rapier world manager, collider builders, step loop
│   │   ├── gravity/           # Vector interpolator, direction controller
│   │   ├── objects/           # Marble, Target, Obstacles, Spawn Gate
│   │   └── levels/            # Level schemas, level definitions, loader
│   ├── stores/                # Zustand stores (gameStore, drawingStore, saveStore)
│   ├── systems/
│   │   ├── audio/             # Sound manager, procedural chime generator
│   │   ├── input/             # Pointer event dispatcher, hotkey listeners
│   │   └── save/              # IndexedDB integration & URL hash serializer
│   ├── utils/                 # Math helpers, Catmull-Rom splines, geometry utilities
│   └── styles/                # Tailwind CSS custom themes & animations
├── tests/
│   ├── unit/                  # Math, splines, serialization, state tests
│   └── integration/           # Level loading, physics loop step tests
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 3. High-Frequency Physics vs. React Rendering Decoupling
To achieve consistent 60+ FPS without React re-render overhead:
1. **Zustand for Discrete Events Only:** Zustand stores track discrete state changes (e.g., tool selection, game state: `READY` $\to$ `RUNNING` $\to$ `WON`, current gravity direction, total ink drawn).
2. **Direct Ref Sync in `useFrame`:**
   - In React Three Fiber's `useFrame((_, delta) => ...)`, Rapier steps forward by a fixed timestep ($1/60\text{s}$).
   - Three.js `Mesh` instances for the marble and dynamic strokes update their `position` and `quaternion` directly from their corresponding `Rapier.RigidBody` references without triggering React state updates.
3. **Event Triggers via Callbacks:**
   - Goal pocket intersection and ball sleep triggers are detected directly in the physics loop and notify the Game Store via single-shot action dispatches.

---

## 4. Drawing Engine Pipeline
```
Pointer Event (Client X, Y)
         │
         ▼
Camera Raycast (Intersect Z = 0 Plane)
         │
         ▼
Distance Filtering (Δd > min_sample_distance)
         │
         ▼
Catmull-Rom Centripetal Spline Smoothing
         │
         ├───► [Visual Branch]: Dynamic Ribbon Extrusion Mesh (smooth tube/flat ribbon)
         │
         └───► [Physics Branch]: Segment Decimation ──► Connected Capsule / Convex Colliders
```

* **Visual Mesh:** Created dynamically using a custom Three.js `BufferGeometry` with rounded normals for soft neumorphic lighting.
* **Physics Colliders:** Decimated down to minimal optimal segments. Each segment is registered in the Rapier world as a capsule or convex hull, ensuring seamless collision without catching the marble on seam edges.

---

## 5. Persistence & Sharing Data Flow
```
Level Cleared
    │
    ▼
saveStore (Zustand)
    │
    ▼
IndexedDB (`levels` table: { levelId, stars, bestInk, completedAt })
    │
    ▼
Level Select Screen (Displays golden stars & unlock badges)
```

**Sandbox URL Sharing:**
```
Sandbox State { strokes: [...], gravity: [x,y,z], obstacles: [...] }
    │
    ▼
Compact JSON ──► LZ-String Deflate ──► URL Base64 Hash (`#c=eNrt...`)
    │
    ▼
Player shares link ──► On mount, app detects `#c=` ──► Inflates to Sandbox
```
