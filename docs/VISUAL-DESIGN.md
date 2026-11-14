# Visual Design Specification — GRAVITY PAINTER

## 1. Visual Identity & Mood
* **Aesthetic:** Minimalist Zen Pastel Neumorphism with tactile, clean clay/porcelain materials and soft studio lighting.
* **Palette:**
  * **Background / Canvas Void:** `#F4F6F9` (Day / Zen Mist) with smooth gradient fallback `#EAEEF3`
  * **Surface / Island Cards:** `#FFFFFF` with soft double drop-shadows:
    * `box-shadow: 6px 6px 14px rgba(166, 180, 200, 0.35), -6px -6px 14px rgba(255, 255, 255, 0.9);`
  * **Static Ink (Strokes):** `#4B7BE5` (Cobalt Pastel) with `#6C92E8` highlight
  * **Dynamic Ink (Strokes):** `#F97066` (Coral Pastel) with `#FDA29B` highlight
  * **Marble Object:** `#2D3748` (Slate Charcoal Ceramic) with crisp specular reflection dot
  * **Target Goal Aura:** `#32D583` (Emerald Mint) with soft pulsating glow
  * **Obstacles / World Blocks:** `#D0D5DD` (Matte Alabaster) with `#98A2B3` bevels
  * **Accent / Stars:** `#FDB022` (Warm Amber Gold)

---

## 2. Typography & Iconography
* **Primary Font:** Inter / System UI Font Stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
* **Styling:**
  * Clean, rounded typography (`font-medium` to `font-bold`)
  * Generous tracking (`tracking-wide`) for titles
  * Minimalist geometric icons (Lucide React or clean inline SVG)

---

## 3. UI Component Specifications

### 3.1 Floating Island HUD
* **Top Bar (`z-30`):**
  * Level Title pill (`bg-white/80 backdrop-blur-md rounded-full shadow-lg px-4 py-2`)
  * 3-Star gauge with animated gold stars based on current ink length
  * Pause / Settings icon button
* **Bottom Tool Dock (`z-30`):**
  * Pill container floating 24px above screen bottom
  * Tools:
    * Static Brush (`[S]` hotkey, Cobalt)
    * Dynamic Brush (`[D]` hotkey, Coral)
    * Eraser (`[E]` hotkey)
    * Undo (`Ctrl+Z`) / Redo (`Ctrl+Y`)
    * Clear Canvas (`Trash` icon)
* **Bottom-Right Gravity Compass (`z-30`):**
  * Circular neumorphic disc with 4 directional arrows (Up, Down, Left, Right)
  * Active gravity direction highlighted with soft glow and subtle directional bias
* **Bottom-Left Simulation Controller (`z-30`):**
  * Big "Play / Release" circular toggle button (Transforms into "Reset" when active)

---

## 4. 3D Lighting & Materials
* **Ambient Light:** Soft skylight `#F8FAFC`, intensity $0.65$
* **Directional Light (Studio Key):** `#FFFFFF`, intensity $1.2$, cast shadows enabled with soft bias (`shadow-bias="-0.0001"`)
* **Fill Light:** Soft warm pastel tone `#FFEFE0`, intensity $0.4$ from opposing lower angle
* **Ground Contact Shadow:** Soft blurred contact plane (`ContactShadows` or baked drop shadow texture) to anchor objects in space
* **Materials:** `meshStandardMaterial` with `roughness: 0.25`, `metalness: 0.1` for ceramic sheen

---

## 5. Micro-Interactions & Animation Rules
* **Stroke Drawing:** Spline points render with dynamic taper; ribbon ends terminate with rounded capsule caps.
* **Gravity Shift:** 0.35s ease-in-out transition. Camera has a slight organic tilt ($\pm 1.5^\circ$) toward the gravity direction, then dampens back to center.
* **Goal Entry:** Gentle radial pastel particle burst, target pocket scales up by $1.15\times$ with smooth spring physics, followed by the victory dialog sliding up smoothly (`framer-motion`).
