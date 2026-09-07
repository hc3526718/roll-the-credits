// Procedural pixel art and visual generation

export function generatePixelAvatar(seed: string): string {
  // Simple 5x5 pixel avatar as SVG
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
  ];
  
  const color = colors[hash % colors.length];
  const pixels: boolean[][] = [];
  
  // Generate symmetric 5x5 pattern
  for (let y = 0; y < 5; y++) {
    pixels[y] = [];
    for (let x = 0; x < 3; x++) {
      const val = ((hash >> (y * 3 + x)) & 1) === 1;
      pixels[y][x] = val;
      pixels[y][4 - x] = val; // mirror
    }
  }
  
  const rects = pixels.flatMap((row, y) =>
    row.map((filled, x) =>
      filled ? `<rect x="${x * 20}" y="${y * 20}" width="20" height="20" fill="${color}"/>` : ''
    )
  ).filter(Boolean).join('');
  
  return `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

export function generateOfficeLayout(tier: 'garage' | 'small' | 'medium' | 'large'): {
  width: number;
  height: number;
  desks: { x: number; y: number }[];
} {
  const layouts = {
    'garage': { width: 300, height: 200, desks: [{ x: 50, y: 80 }, { x: 200, y: 80 }] },
    'small': { width: 400, height: 300, desks: [
      { x: 50, y: 100 }, { x: 200, y: 100 }, { x: 350, y: 100 },
      { x: 50, y: 200 }, { x: 200, y: 200 }
    ]},
    'medium': { width: 600, height: 400, desks: [
      { x: 50, y: 100 }, { x: 200, y: 100 }, { x: 350, y: 100 }, { x: 500, y: 100 },
      { x: 50, y: 200 }, { x: 200, y: 200 }, { x: 350, y: 200 }, { x: 500, y: 200 },
      { x: 50, y: 300 }, { x: 200, y: 300 }
    ]},
    'large': { width: 800, height: 500, desks: [] }
  };
  
  return layouts[tier];
}
