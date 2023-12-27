import gameInstance from '../Game/Game.js';
import Piece from './Piece.js';

/**
 * Represents a Pawn chess piece.
 * @extends Piece
 */
export default class Pawn extends Piece {
  /**
   * Creates a new Pawn chess piece.
   * @constructor
   * @param {Object} position - The initial position of the piece on the board.
   * @param {Player} player - The player to whom the piece belongs.
   * @param {string} color - The color of the piece (e.g., 'white' or 'black').
   * @param {string} name - The name of the piece (e.g., 'pawn').
   */
  constructor(position, player, color, name) {
    super(position, player, color, name);

    /**
     * The value assigned to the pawn for scoring purposes.
     * The value is a numeric score representing the piece's importance.
     * @type {number}
     */
    this.value = 1;

    /**
     * The direction in which the pawn can move (1 for white, -1 for black).
     * @type {number}
     */
    this.direction = this.color === 'white' ? 1 : -1;

    /**
     * The row at which the pawn can perform en passant captures.
     * @type {number}
     */
    this.enPassantRow = this.color === 'white' ? 4 : 3;

    /**
     * The row at which the pawn can be promoted.
     * @type {number}
     */
    this.promotionRow = this.color === 'white' ? 7 : 0;
  }

  /**
   * Sets the possible moves for the pawn, including forward movement, capture, and en passant.
   * @returns {Array<Object>} An array of possible move positions.
   */
  setPossibleMoves = () => {
    const possibleMoves = [];

    // Merge all type of valid moves into the possible move array.
    this.forwardMovement(possibleMoves);
    this.captureMovement(possibleMoves);
    this.enPassantMovement(possibleMoves);

    return possibleMoves;
  }

  /**
   * Adds possible forward movements to the array.
   * @param {Array<Object>} arr - The array to which possible moves are added.
   */
  forwardMovement = (arr) => {
    // Set the maximum distance that the pawn can move by checking if it has already moved before.
    const maxDistance = !this.hasMoved ? 2 : 1;

    // Loop through each vertical step of the pawn.
    for (let i = 1; i <= maxDistance; i++) {
      // Set the move based on the direction of the pawn (white moves upwards, while black moves downwards).
      const move = { row: this.position.row + i * this.direction, col: this.position.col };
      const targetPiece = gameInstance.board.getPieceFromGrid(move);

      // If there is a piece in front of the pawn, break (as it can't move through pieces).
      if (targetPiece) {
        break;
      }

      // If the next row is a promotion row, set the move with a special case to trigger a promotion.
      if (move.row === this.promotionRow) {
        move = { ...move, case: 'promotion' };
      }

      arr.push(move);
    }
  }

  /**
   * Adds possible capture movements to the array.
   * @param {Array<Object>} arr - The array to which possible moves are added.
   */
  captureMovement = (arr) => {
    // Loop through the possible capture squares (one up + left/right).
    for (const [x, y] of [[this.direction, -1], [this.direction, 1]]) {
      const move = { row: this.position.row + x, col: this.position.col + y };

      if (gameInstance.board.isPositionInBounds(move)) {
        const targetPiece = gameInstance.board.getPieceFromGrid(move);

        // If the next row is a promotion row, set the move with a special case to trigger a promotion.
        if (move.row === this.promotionRow) {
          move = { ...move, case: 'promotion' };
        }

        // If there is an opponent piece on the square, add it as a valid capture.
        if (targetPiece && targetPiece.player !== this.player) {
          arr.push(move);
        }
      }
    }
  }

  /**
   * Adds possible en passant movements to the array.
   * @param {Array<Object>} arr - The array to which possible moves are added.
   */
  enPassantMovement = (arr) => {
    // Checks if the selected pawn is on the en passant row.
    if (this.position.row === this.enPassantRow) {
      // Get the last move of the opponent
      const opponent = gameInstance.getOpponent();
      const opponentLastMove = opponent.moves[opponent.moves.length - 1];

      // Check if the last move of the opponent adhered to the rules of en passant.
      if (
        opponentLastMove.piece === 'pawn' &&
        opponentLastMove.toPosition.row === this.position.row &&
        Math.abs(opponentLastMove.toPosition.col - this.position.col) === 1 &&
        Math.abs(opponentLastMove.toPosition.row - opponentLastMove.fromPosition.row) === 2
      ) {
        const move = { row: opponentLastMove.toPosition.row + this.direction, col: opponentLastMove.toPosition.col, case: 'en-passant', direction: this.direction };
        arr.push(move);
      }
    }
  }
}