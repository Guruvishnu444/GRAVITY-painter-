import { describe, it, expect } from 'vitest';
import { LEVELS, getLevelById } from '../../src/game/levels/levelData';

describe('Level Definitions & Data System', () => {
  it('loads all three foundation campaign levels', () => {
    expect(LEVELS.length).toBe(3);
    expect(LEVELS[0].id).toBe('ch1-01');
    expect(LEVELS[1].id).toBe('ch1-02');
    expect(LEVELS[2].id).toBe('ch1-03');
  });

  it('retrieves specific level by id', () => {
    const level2 = getLevelById('ch1-02');
    expect(level2.title).toBe('The Chasm Leap');
    expect(level2.obstacles.length).toBeGreaterThan(0);
    expect(level2.targetInk).toBe(16.5);
  });

  it('falls back to level 1 for unknown id', () => {
    const fallback = getLevelById('unknown-id');
    expect(fallback.id).toBe('ch1-01');
  });
});
