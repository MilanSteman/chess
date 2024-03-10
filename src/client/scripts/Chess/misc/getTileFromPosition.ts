/**
 * Gets a tile name (e.g. 'a1') from a position of a row and column
 * @returns String with the tile name ('e.g. h4')
 */
function getTileFromPosition(
  row: number,
  col: number,
  boundary: number = 8,
): string {
  // Sets the column letter (starting at 'a')
  const colLetter = String.fromCharCode("a".charCodeAt(0) + col);
  return `${colLetter}${boundary - row}`;
}

export { getTileFromPosition };
