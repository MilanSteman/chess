import Piece from "./Piece.js";
import { repeatingMove } from "../misc/moveHelper.js";

/**
 * Represents a Bishop chess piece.
 * @extends Piece
 */
export default class Bishop extends Piece {
  /**
   * Creates a new Bishop chess piece.
   * @constructor
   * @param {Object} position - The initial position of the piece on the board.
   * @param {Player} player - The player to whom the piece belongs.
   * @param {string} color - The color of the piece (e.g., 'white' or 'black').
   * @param {string} name - The name of the piece (e.g., 'bishop').
   */
  constructor(position, player, color, name) {
    super(position, player, color, name);

    /**
     * Possible movement directions for a bishop.
     * Each direction is represented as a pair [row, col].
     * For a bishop, it can move diagonally in four directions.
     * @type {Array<[number, number]>}
     */
    this.directions = [
      [1, 1],    // down-right
      [-1, 1],   // up-right
      [-1, -1],  // up-left
      [1, -1],   // down-left
    ];

    /**
     * The value assigned to the bishop for scoring purposes.
     * The value is a numeric score representing the piece's importance.
     * @type {number}
     */
    this.value = 3;
  }

  /**
   * Sets the possible moves for the bishop based on its repeating moves.
   * @returns {Array<Object>} An array of possible move positions.
   */
  setPossibleMoves = () => {
    return repeatingMove(this.position, this.player, this.directions);
  }
}
