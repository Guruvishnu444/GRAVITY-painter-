# Physics Specification Document — GRAVITY PAINTER

## 1. Physics Engine Configuration
* **Engine:** Rapier3D (`@dimforge/rapier3d-compat`)
* **Simulation Timestep:** Fixed $\Delta t = 1/60\text{ s} \approx 0.01667\text{ s}$
* **Max Substeps:** Up to 2 substeps per frame to prevent tunneling during low-framerate hitches.
* **Continuous Collision Detection (CCD):** Enabled on the **Marble** rigid body to strictly prevent clipping through thin player-drawn structures at high velocity.
* **Solver Iterations:**
  * Velocity iterations: 4
  * Position iterations: 2

---

## 2. World Coordinate System & Interaction Boundaries
* **World Axes:**
  * $+X$: Screen Right
  * $-X$: Screen Left
  * $+Y$: Screen Up
  * $-Y$: Screen Down
  * $+Z$: Toward Camera
  * $-Z$: Away from Camera (Depth)
* **Interaction Plane:** Vertical $Z = 0$ slice.
* **Boundary Box Colliders:**
  * Invisible static planar walls constrain dynamic objects to $-0.5 \le Z \le 0.5$, ensuring 2.5D physical stability without objects drifting into deep 3D space.
  * Level bounding box: $X \in [-14, 14]$, $Y \in [-9, 9]$. If the marble escapes this boundary, an automatic auto-reset occurs after $1.5\text{ seconds}$.

---

## 3. Physical Materials & Coefficients

| Entity | Type | Density / Mass | Restitution (Bounce) | Friction | Damping |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Marble** | Dynamic (`RigidBodyType.Dynamic`) | $1.0\text{ kg}$ ($r=0.35$) | $0.25$ | $0.40$ | Linear: $0.1$, Angular: $0.2$ |
| **Static Strokes** | Fixed (`RigidBodyType.Fixed`) | $\infty$ | $0.20$ | $0.50$ | N/A |
| **Dynamic Strokes** | Dynamic (`RigidBodyType.Dynamic`) | $2.0\text{ kg/unit length}$ | $0.15$ | $0.60$ | Linear: $0.3$, Angular: $0.4$ |
| **Level Obstacles**| Fixed (`RigidBodyType.Fixed`) | $\infty$ | $0.30$ | $0.40$ | N/A |
| **Target Pocket**  | Sensor (`ColliderDesc.ball(0.45).setSensor(true)`) | N/A | N/A | N/A | Trigger Volume |

---

## 4. Gravity Interpolation Math
When a gravity change is initiated from current vector $\vec{g}_{\text{start}}$ to target vector $\vec{g}_{\text{target}}$:
$$\vec{g}(t) = \text{slerp}(\vec{g}_{\text{start}}, \vec{g}_{\text{target}}, \tau(t))$$
where:
$$\tau(t) = \text{smoothstep}\left(\frac{t}{T_{\text{duration}}}\right), \quad T_{\text{duration}} = 0.35\text{ seconds}$$
This ensures:
1. Zero discontinuous velocity spikes or physics explosions on rigid bodies.
2. An elegant, sweeping parabolic arc when changing gravity while the marble is airborne.
3. Complete determinism and reproducibility.

---

## 5. Collision Groups & Interaction Matrix
Bitwise collision groups partition physics entities:
* `GROUP_ENVIRONMENT (0x0001)`: Level platforms, obstacles, and boundary walls.
* `GROUP_MARBLE (0x0002)`: The rolling ball.
* `GROUP_STROKE_STATIC (0x0004)`: Player-drawn static lines.
* `GROUP_STROKE_DYNAMIC (0x0008)`: Player-drawn movable bodies.
* `GROUP_TARGET (0x0010)`: Goal sensor.

**Matrix Rules:**
* Marble collides with Environment, Static Strokes, Dynamic Strokes, and triggers Target.
* Dynamic Strokes collide with Environment, Marble, and other Dynamic Strokes.
* Target sensor only tracks Marble entries.
