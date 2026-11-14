# Level Design Specification — GRAVITY PAINTER

## 1. Design Philosophy
Levels in GRAVITY PAINTER follow the Nintendo/Miyamoto four-step design model (*Kishōtenketsu*):
1. **Introduction:** Introduce a mechanic in safe isolation.
2. **Development:** Combine the mechanic with earlier knowledge.
3. **Twist:** Subvert expectations with a surprise obstacle or requirement.
4. **Mastery:** A culminating puzzle that demands thoughtful synthesis.

---

## 2. Level Data Schema (TypeScript)
All levels are defined declaratively as pure JSON-serializable TypeScript structures:

```typescript
export interface LevelDefinition {
  id: string;                      // e.g. "ch1-01"
  chapter: number;                 // 1 to 4
  number: number;                  // 1 to 5
  title: string;                   // Display title
  description: string;             // Short hint or narrative context
  targetInk: number;               // Ink length for 3-star score
  spawn: {
    position: [number, number, number]; // [x, y, z]
    initialVelocity?: [number, number, number];
  };
  target: {
    position: [number, number, number];
    radius: number;
  };
  obstacles: Array<{
    id: string;
    type: 'box' | 'cylinder' | 'wedge';
    position: [number, number, number];
    dimensions: [number, number, number]; // [width, height, depth] or [radius, height, 0]
    rotation?: [number, number, number];  // Euler angles
    color?: string;
  }>;
  allowedBrushes: ('static' | 'dynamic')[];
  initialGravity: 'down' | 'up' | 'left' | 'right';
  allowedGravityDirections: ('down' | 'up' | 'left' | 'right')[];
}
```

---

## 3. Initial Campaign Showcase (First 3 Foundation Levels)

### Level 1: "The Gentle Slope" (Tutorial / Baseline)
* **Objective:** Introduce basic drawing and slope mechanics.
* **Layout:**
  * Ball Spawn: Left elevated platform at $(-8, 4, 0)$.
  * Gap: Wide empty void from $X = -6$ to $X = 2$.
  * Target Pocket: Right platform at $(6, -2, 0)$.
* **Solution:** Draw a single downward ramp bridging the gap to guide the marble smoothly into the goal.
* **Target Ink:** $12.0\text{ units}$.

### Level 2: "The Chasm Leap" (Momentum & Funneling)
* **Objective:** Teach funnel creation and velocity retention.
* **Layout:**
  * Ball Spawn: High center-left at $(-6, 6, 0)$.
  * Obstacle: A tall central pillar at $X = 0$, $Y \in [-4, 3]$.
  * Target Pocket: Deep lower-right corner at $(7, -5, 0)$.
* **Solution:** Draw a steep drop curve around the pillar that turns into an upward ramp, launching the marble over the gap into a collection funnel.
* **Target Ink:** $16.5\text{ units}$.

### Level 3: "Inverted Horizon" (First Gravity Shift)
* **Objective:** Introduce 4-way gravity manipulation.
* **Layout:**
  * Ball Spawn: Bottom-left floor at $(-7, -5, 0)$.
  * Obstacle: Complete floor-to-ceiling barrier at $X = 0$ with an opening only at the very top ceiling ($Y = 7$).
  * Target Pocket: Ceiling pocket on the right side at $(6, 5, 0)$.
* **Solution:** Draw a starter ramp, flip gravity $\uparrow \mathbf{UP}$ mid-run so the marble flies through the ceiling gap, then shift gravity $\rightarrow \mathbf{RIGHT}$ or $\downarrow \mathbf{DOWN}$ into the ceiling pocket.
* **Target Ink:** $14.0\text{ units}$.
