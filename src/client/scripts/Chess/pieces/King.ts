import { findAllInstancesOfPiece } from "../misc/findPieceFromGrid.js";
import { moveInDirection } from "../misc/moveInDirection.js";
import { Game } from "../game/Game.js";
import { Board } from "../game/Board.js";
import { CastlingType } from "../enums/Castling.js";
import { Players } from "../enums/Players.js";
import { PotentialMove } from "../interfaces/Move.js";
import { Piece } from "./Piece.js";
import { Rook } from "./Rook.js";
import { PieceValue } from "../enums/PieceValue.js";
import { isInCheckAfterMove } from "../misc/isInCheck.js";

/**
 * Represents a king chess piece
 */
class King extends Piece {
  constructor(name: string, color: Players, row: number, col: number) {
    super(name, color, row, col);
    this.value = PieceValue.KING;
  }

  /**
   * Calculates and returns an array of possible moves for the king
   * The king can move one square in any direction and perform castling under certain conditions
   * @returns An array of possible moves (row and col pairs) for the king
   */
  public getPossibleMoves(): PotentialMove[] {
    const directions: number[][] = [
      [1, 1],    // down-right
      [-1, 1],   // up-right
      [-1, -1],  // up-left
      [1, -1],   // down-left
      [1, 0],    // down
      [-1, 0],   // up
      [0, 1],    // right
      [0, -1],   // left
    ];

    // Calculate standard moves
    const moves: PotentialMove[] = moveInDirection(this.row, this.col, directions, false);

    // Add all possible castling moves to the moves array
    this.castleMoves(moves);

    return moves;
  }

  /**
   * Adds castling moves to the provided array of moves
   * Castling is a special move for the king and Rook under certain conditions
   * @param moves - The array to store the calculated moves
   */
  private castleMoves(moves: PotentialMove[]): void {
    // Check conditions for castling: king has not moved, it's the king's turn, and the king is not in check
    if (this.hasMoved || this.color !== Game.currentPlayer?.color || isInCheckAfterMove(this, this.row, this.col)) {
      return;
    }

    // Find all Rooks of the same color that have not moved
    const rooks: Piece[] | null = findAllInstancesOfPiece(Board.grid, Rook.name.toLowerCase(), this.color);

    // Return if no eligible rooks are found
    if (!rooks) {
      return;
    }

    // Iterate through eligible rooks
    rooks.forEach((rook) => {
      if (rook.hasMoved) {
        return;
      }

      // Determine the castling type (long or short) based on rook's position relative to the king
      const castleType: string = rook.col < this.col ? CastlingType.LONG : CastlingType.SHORT;

      // Determine the castling destination square
      const castlingDest: number = castleType === CastlingType.LONG ? -2 : 2;

      // Determine the start and end squares for castling
      const [startSquare, endSquare]: number[] = rook.col < this.col ? [rook.col, this.col] : [this.col, rook.col];

      // Check if the path between the king and rook is clear
      if (this.isPathClear(startSquare, endSquare)) {
        moves.push({ row: this.row, col: this.col + castlingDest, specialMove: castleType });
      }
    });
  }

  /**
   * Checks if the path between two columns is clear on the same row
   * @returns True if the path is clear, otherwise false
   */
  private isPathClear(start: number, end: number): boolean {
    for (let i = start + 1; i < end; i++) {
      // Check if the move would put the king in check
      if (isInCheckAfterMove(this, this.row, i)) {
        return false;
      }

      // Check if there is a piece in the path
      const pieceBetween: Piece | null = Board.grid[this.row][i];

      if (pieceBetween) {
        return false;
      }
    }

    return true;
  }
}

export { King };