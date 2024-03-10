import { moveInDirection } from "../misc/moveInDirection.js";
import { PieceValue } from "../enums/PieceValue.js";
import { Players } from "../enums/Players.js";
import { PotentialMove } from "../interfaces/Move.js";
import { Piece } from "./Piece.js";

/**
 * Represents a bishop chess piece
 */
class Bishop extends Piece {
  constructor(name: string, color: Players, row: number, col: number) {
    super(name, color, row, col);
    this.value = PieceValue.BISHOP;
  }

  /**
   * Calculates and returns an array of possible moves for the bishop
   * The bishop moves diagonally across the chessboard
   */
  public getPossibleMoves(): PotentialMove[] {
    const directions: number[][] = [
      [1, 1],   // down-right
      [-1, 1],  // up-right
      [-1, -1], // up-left
      [1, -1],  // down-left
    ];

    return moveInDirection(this.row, this.col, directions, true);
  }
}

export { Bishop };