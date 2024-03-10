import { moveInDirection } from "../misc/moveInDirection.js";
import { PieceValue } from "../enums/PieceValue.js";
import { Players } from "../enums/Players.js";
import { PotentialMove } from "../interfaces/Move.js";
import { Piece } from "./Piece.js";

/**
 * Represents a knight chess piece
 */
class Knight extends Piece {
  constructor(name: string, color: Players, row: number, col: number) {
    super(name, color, row, col);
    this.value = PieceValue.KNIGHT;
  }

  /**
   * Calculates and returns an array of possible moves for the knight
   * Knights have a unique L-shaped move pattern, moving two squares in one direction
   * and one square perpendicular to that direction
   * @returns An array of possible moves (row and col pairs) for the knight
   */
  public getPossibleMoves(): PotentialMove[] {
    const directions: number[][] = [
      [2, -1],  // two up, one left
      [2, 1],   // two up, one right
      [-2, -1], // two down, one left
      [-2, 1],  // two down, one right
      [-1, 2],  // one down, two right
      [1, 2],   // one up, two right
      [-1, -2], // one down, two left
      [1, -2],  // one up, two left
    ];

    return moveInDirection(this.row, this.col, directions, false);
  }
}

export { Knight };