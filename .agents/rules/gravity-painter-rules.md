# GRAVITY PAINTER — Development Rules

1. **Step-by-Step Discipline:** Never jump ahead or build entire features without explicit plan approval.
2. **Physics/Render Separation:** Keep high-frequency Rapier physics simulation out of React state. Sync Three.js meshes directly via refs in `useFrame`.
3. **No Fake Physics:** All motion and collisions must be solved by Rapier3D; never manually move physical entities via lerp/timers to fake physics.
4. **Zero Broken Controls:** Every visible button, icon, and dial must perform a working action.
5. **No Visual Bloat:** Preserve the clean, minimalist pastel neumorphic aesthetic. Visual effects must serve clarity and tactile satisfaction.
6. **Zero Silent Changes:** Never alter agreed rules, schemas, or requirements without prior discussion and confirmation.
7. **Git Checkpoints:** Preserve working versions with clean Git commits after every verified milestone.
