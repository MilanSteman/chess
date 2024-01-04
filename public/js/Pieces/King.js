import Piece from "./Piece.js";
import {
  isInCheck,
  isInCheckAfterMove,
  singleMove,
} from "../misc/moveHelper.js";

/**
 * Represents a King chess piece.
 * @extends Piece
 */
export default class King extends Piece {
  /**
   * Creates a new King chess piece.
   * @constructor
   * @param {Object} position - The initial position of the piece on the board.
   * @param {Player} player - The player to whom the piece belongs.
   * @param {string} color - The color of the piece (e.g., 'white' or 'black').
   * @param {string} name - The name of the piece (e.g., 'king').
   * @param {Game} game - The game instance the piece is part of.
   */
  constructor(position, player, color, name, game) {
    super(position, player, color, name, game);

    /**
     * Possible movement directions for a king.
     * Each direction is represented as a pair [row, col].
     * A king can move in eight directions, including castling.
     * @type {Array<[number, number]>}
     */
    this.directions = [
      [1, 1], // down-right
      [-1, 1], // up-right
      [-1, -1], // up-left
      [1, -1], // down-left
      [1, 0], // down
      [-1, 0], // up
      [0, 1], // right
      [0, -1], // left
    ];

    /**
     * The value assigned to the king for scoring purposes.
     * The value is a numeric score representing the piece's importance.
     * @type {number}
     */
    this.value = 9;
  }

  /**
   * Sets the possible moves for the king based on its single moves.
   * @returns {Array<Object>} An array of possible move positions.
   */
  setPossibleMoves = () => {
    const possibleMoves = singleMove(this);

    // Push castling moves to the possible moves.
    this.castleMovement(possibleMoves);

    return possibleMoves;
  };

  /**
   * Checks and adds possible castling moves for the king.
   * @param {Array<Object>} arr - The array to which possible moves are added.
   * @returns {boolean} Returns false if castling is not possible; otherwise, true.
   */
  castleMovement = (arr) => {
    // Check if the king hasn't moved, isn't the opponent and is not in check.
    if (
      !this.hasMoved &&
      this.player === this.game.currentPlayer &&
      !isInCheck(this.game)
    ) {
      // Get the allied rooks.
      const allyPieces = this.player.pieces;
      const allyRooks = allyPieces.filter((piece) => piece.name === "rook");

      allyRooks.forEach((allyRook) => {
        // Check if target rook hasn't moved.
        if (!allyRook.hasMoved) {
          // Set position and name based on if it is a long or short castle.
          const castleType =
            allyRook.position.col < this.position.col ? "O-O-O" : "O-O";
          const castleOffset = castleType === "O-O-O" ? -2 : 2;

          // Set the start and end column. For both properties, this can result in being either the position of the king or rook based on the castling type.
          const colRange = {
            startCol:
              allyRook.position.col < this.position.col
                ? allyRook.position.col
                : this.position.col,
            endCol:
              allyRook.position.col < this.position.col
                ? this.position.col
                : allyRook.position.col,
          };

          // Loop through each of the squares between the king and rook.
          for (let i = colRange.startCol + 1; i <= colRange.endCol - 1; i++) {
            // Check if there are pieces in between the king and rook.
            const pieceBetween = this.game.board.getPieceFromGrid({
              row: this.position.row,
              col: i,
            });

            // If there is a piece in between the king and rook, return false. As you can't castle through pieces.
            if (pieceBetween) {
              return false;
            }

            // If the king is in check after moving on one of the spots between the rook, return false (illegal move).
            if (isInCheckAfterMove(this, { row: this.position.row, col: i })) {
              return false;
            }
          }

          // Set the move data of the castling move if it is valid and push it to the array.
          const newPosition = {
            row: this.position.row,
            col: this.position.col + castleOffset,
            case: "castle",
            type: castleType,
          };
          arr.push(newPosition);
        }
      });
    }
    return true;
  };
}
