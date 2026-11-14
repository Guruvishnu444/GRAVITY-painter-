export interface ObstacleDef {
  id: string;
  type: 'box';
  position: [number, number, number];
  dimensions: [number, number, number]; // [width, height, depth]
  color?: string;
}

export interface LevelDefinition {
  id: string;
  chapter: number;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  targetInk: number;
  spawnPosition: [number, number, number];
  targetPosition: [number, number, number];
  platforms: Array<{
    id: string;
    position: [number, number, number];
    dimensions: [number, number, number];
  }>;
  obstacles: ObstacleDef[];
  initialGravity: 'down' | 'up' | 'left' | 'right';
  allowedBrushes: ('static' | 'dynamic')[];
}

export const LEVELS: LevelDefinition[] = [
  {
    id: 'ch1-01',
    chapter: 1,
    number: 1,
    title: 'The Gentle Slope',
    subtitle: 'Chapter 1: The First Stroke',
    description: 'Draw a downward ramp across the chasm to guide the marble smoothly into the goal.',
    targetInk: 12.0,
    spawnPosition: [-8, 4.0, 0],
    targetPosition: [6, -2.5, 0],
    platforms: [
      { id: 'p1', position: [-7.5, 3.25, 0], dimensions: [5, 0.5, 2] },
      { id: 'p1-bumper', position: [-10.1, 4.25, 0], dimensions: [0.4, 2, 2] },
      { id: 'p2', position: [6, -3.25, 0], dimensions: [6, 0.5, 2] },
    ],
    obstacles: [],
    initialGravity: 'down',
    allowedBrushes: ['static', 'dynamic'],
  },
  {
    id: 'ch1-02',
    chapter: 1,
    number: 2,
    title: 'The Chasm Leap',
    subtitle: 'Chapter 1: The First Stroke',
    description: 'A central pillar blocks direct passage. Curve your path around it to maintain momentum.',
    targetInk: 16.5,
    spawnPosition: [-7, 6.0, 0],
    targetPosition: [7, -4.0, 0],
    platforms: [
      { id: 'p1', position: [-7, 5.25, 0], dimensions: [4, 0.5, 2] },
      { id: 'p1-bumper', position: [-9.1, 6.25, 0], dimensions: [0.4, 2, 2] },
      { id: 'p2', position: [7, -4.75, 0], dimensions: [4, 0.5, 2] },
    ],
    obstacles: [
      {
        id: 'obs-pillar',
        type: 'box',
        position: [0, 0, 0],
        dimensions: [1.6, 7.0, 2],
      },
    ],
    initialGravity: 'down',
    allowedBrushes: ['static', 'dynamic'],
  },
  {
    id: 'ch1-03',
    chapter: 1,
    number: 3,
    title: 'Inverted Horizon',
    subtitle: 'Chapter 1: Vector Shifts',
    description: 'The target is on the ceiling! Draw a ramp, release the ball, and flip gravity UP to reach the goal.',
    targetInk: 15.0,
    spawnPosition: [-7, -4.0, 0],
    targetPosition: [6, 4.5, 0],
    platforms: [
      { id: 'p1', position: [-7, -4.75, 0], dimensions: [5, 0.5, 2] },
      { id: 'p1-bumper', position: [-9.6, -3.75, 0], dimensions: [0.4, 2, 2] },
      { id: 'p2', position: [6, 5.25, 0], dimensions: [5, 0.5, 2] },
    ],
    obstacles: [
      {
        id: 'obs-wall',
        type: 'box',
        position: [0, -1.0, 0],
        dimensions: [1.2, 8.0, 2],
      },
    ],
    initialGravity: 'down',
    allowedBrushes: ['static', 'dynamic'],
  },
];

export function getLevelById(id: string): LevelDefinition {
  return LEVELS.find((l) => l.id === id) || LEVELS[0];
}
