interface PixelHeartProps {
  filled: boolean;
  size?: number;
}

/**
 * Minecraft-style pixelated heart rendered as SVG.
 * Uses a grid of squares to create the blocky heart silhouette.
 */
export function PixelHeart({ filled, size = 24 }: PixelHeartProps) {
  // 9x9 grid representing the heart shape (1 = pixel, 0 = empty)
  const grid = [
    [0, 1, 1, 0, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
  ];

  const cellSize = size / 9;
  const filledColor = '#ef4444';
  const emptyColor = '#3b3b3b';
  const darkRed = '#991b1b';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="flex-shrink-0"
      style={{ imageRendering: 'pixelated' }}
    >
      {grid.map((row, y) =>
        row.map((val, x) => {
          if (val === 0) return null;

          if (filled) {
            // Add a darker bottom edge for depth (last 2 rows)
            const isDarkEdge = y >= 6;
            const isHighlight = (x <= 2 && y <= 2 && val === 1 && (y === 0 || (x === 1 && y === 1)));
            return (
              <rect
                key={`${x}-${y}`}
                x={x * cellSize}
                y={y * cellSize}
                width={cellSize + 0.5}
                height={cellSize + 0.5}
                fill={isHighlight ? '#fca5a5' : isDarkEdge ? darkRed : filledColor}
              />
            );
          }

          return (
            <rect
              key={`${x}-${y}`}
              x={x * cellSize}
              y={y * cellSize}
              width={cellSize + 0.5}
              height={cellSize + 0.5}
              fill={emptyColor}
            />
          );
        })
      )}
    </svg>
  );
}
