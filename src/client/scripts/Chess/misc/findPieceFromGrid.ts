import { Piece } from "../pieces/Piece";

/**
 * Finds a single instance of a piece within a two-dimensional array
 * @returns A single piece
 */
function findSingleInstanceofPiece(
  arr: (Piece | null)[][],
  name: string,
  color: string | null = null,
): Piece | null {
  return arr
    .flat()
    .find(
      (piece) =>
        piece && piece.name === name && (color ? piece.color === color : true),
    )!;
}

/**
 * Finds all instances of a piece within a two-dimensional array
 * @returns Array of all instances of a piece
 */
function findAllInstancesOfPiece(
  arr: (Piece | null)[][],
  name: string,
  color: string | null = null,
): Piece[] | null {
  const filteredArray = arr
    .flat()
    .filter(
      (piece) =>
        piece && piece.name === name && (color ? piece.color === color : true),
    );
  return filteredArray.length > 0 ? (filteredArray as Piece[]) : null;
}

/**
 * Finds all pieces from a grid based on a color
 * @returns Array of all pieces of a certain player (color)
 */
function findAllPiecesFromPlayer(
  arr: (Piece | null)[][],
  color: string | undefined,
): Piece[] | null {
  const filteredArray = arr
    .flat()
    .filter((piece) => piece && piece.color === color);
  return filteredArray.length > 0 ? (filteredArray as Piece[]) : null;
}

export {
  findSingleInstanceofPiece,
  findAllInstancesOfPiece,
  findAllPiecesFromPlayer,
};
