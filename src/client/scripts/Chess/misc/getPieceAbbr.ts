/**
 * Gets the abbreviation of a piece based on it's name
 * @returns a string of a single letter
 */
function getPieceAbbr(name: string, isAnnotation?: boolean): string {
  if (isAnnotation && name === "pawn") {
    return "";
  }

  return name === "knight" ? "N" : name.charAt(0).toUpperCase();
}

export { getPieceAbbr };
