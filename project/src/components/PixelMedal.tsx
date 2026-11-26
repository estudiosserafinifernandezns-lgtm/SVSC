interface PixelMedalProps {
  rank: 1 | 2 | 3;
  size?: number;
}

/**
 * Retro-game-style pixel medal rendered as SVG.
 * Gold (rank 1), silver (rank 2), bronze (rank 3).
 * Includes a pixelated ribbon at the top and a decorative border.
 */
export function PixelMedal({ rank, size = 24 }: PixelMedalProps) {
  const palettes = {
    1: { main: '#fbbf24', dark: '#d97706', light: '#fde68a', ribbon: '#dc2626', ribbonDark: '#991b1b' },
    2: { main: '#cbd5e1', dark: '#64748b', light: '#e2e8f0', ribbon: '#3b82f6', ribbonDark: '#1e40af' },
    3: { main: '#d97706', dark: '#92400e', light: '#fbbf24', ribbon: '#7c3aed', ribbonDark: '#5b21b6' },
  };

  const p = palettes[rank];
  const s = size / 14;

  // Ribbon (top part) — 3x2 pixels
  const ribbon = [
    [p.ribbon, p.ribbon, p.ribbon],
    [p.ribbonDark, p.ribbonDark, p.ribbonDark],
  ];

  // Medal body — 10x10 grid, circular-ish shape
  const medalGrid = [
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  ];

  // Highlight: top-left area gets lighter shade
  const highlightCells = new Set(['1,2', '1,3', '2,1', '2,2', '2,3', '3,1', '3,2']);
  // Dark edge: bottom-right gets dark shade
  const darkCells = new Set(['6,7', '6,8', '7,6', '7,7', '7,8', '8,6', '8,7']);

  const ribbonW = 3 * s;
  const ribbonH = 2 * s;
  const medalW = 10 * s;
  const medalH = 10 * s;
  const offsetX = (size - medalW) / 2;
  const ribbonOffsetX = (size - ribbonW) / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="flex-shrink-0"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Ribbon */}
      {ribbon.map((row, y) =>
        row.map((color, x) => (
          <rect
            key={`r-${x}-${y}`}
            x={ribbonOffsetX + x * s}
            y={y * s}
            width={s + 0.5}
            height={s + 0.5}
            fill={color}
          />
        ))
      )}

      {/* Medal body */}
      {medalGrid.map((row, y) =>
        row.map((val, x) => {
          if (val === 0) return null;
          const key = `${y},${x}`;
          let fill = p.main;
          if (highlightCells.has(key)) fill = p.light;
          else if (darkCells.has(key)) fill = p.dark;
          return (
            <rect
              key={`m-${x}-${y}`}
              x={offsetX + x * s}
              y={ribbonH + y * s}
              width={s + 0.5}
              height={s + 0.5}
              fill={fill}
            />
          );
        })
      )}
    </svg>
  );
}
