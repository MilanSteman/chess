/**
 * Checks whether a position of row and col is within a certain boundary
 * @returns True if the row and col are within the boundary
 */
function isPositionInBounds(
  row: number,
  col: number,
  boundary: number = 8,
): boolean {
  return row >= 0 && row < boundary && col >= 0 && col < boundary;
}

export { isPositionInBounds };
