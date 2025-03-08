export interface Position {
  x: number;
  y: number;
}

export const calculateGridPositions = (
  itemCount: number,
  cellSize: number = 80
): Position[] => {
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;

  const gridColumns = Math.floor(windowWidth / cellSize);
  const gridRows = Math.floor(windowHeight / cellSize);

  const positions: Position[] = [];

  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridColumns; col++) {
      positions.push({
        x: col * cellSize + cellSize / 2,
        y: row * cellSize + cellSize / 2,
      });
    }
  }

  return positions;
};
