export interface Position {
  x: number;
  y: number;
}

export const calculateGridPositions = (
  itemCount: number,
  cellSize: number = 80
): Position[] => {
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

  const gridColumns = Math.floor(windowWidth / cellSize);
  const gridRows = Math.floor(windowHeight / cellSize);

  let columns = Math.ceil(Math.sqrt(itemCount));
  let rows = Math.ceil(itemCount / columns);

  columns = Math.min(columns, gridColumns - 2);
  rows = Math.min(rows, gridRows - 2);

  if (columns * rows < itemCount) {
    if (gridColumns > gridRows) {
      columns = Math.min(itemCount, gridColumns - 2);
      rows = Math.ceil(itemCount / columns);
    } else {
      rows = Math.min(itemCount, gridRows - 2);
      columns = Math.ceil(itemCount / rows);
    }
  }

  const startX =
    Math.floor((gridColumns - columns) / 2) * cellSize + cellSize / 2;
  const startY = Math.floor((gridRows - rows) / 2) * cellSize + cellSize / 2;

  const positions: Position[] = [];
  let index = 0;

  for (let row = 0; row < rows && index < itemCount; row++) {
    for (let col = 0; col < columns && index < itemCount; col++) {
      positions.push({
        x: startX + col * cellSize,
        y: startY + row * cellSize,
      });
      index++;
    }
  }

  return positions;
};
