import Piece from "./Piece.js";
import { singleMove } from "../misc/moveHelper.js";

/**
 * Represents a Knight chess piece.
 * @extends Piece
 */
export default class Knight extends Piece {
  /**
   * Creates a new Knight chess piece.
   * @constructor
   * @param {Object} position - The initial position of the piece on the board.
   * @param {Player} player - The player to whom the piece belongs.
   * @param {string} color - The color of the piece (e.g., 'white' or 'black').
   * @param {string} name - The name of the piece (e.g., 'knight').
   */
  constructor(position, player, color, name, game) {
    super(position, player, color, name, game);

    /**
     * Possible movement directions for a knight.
     * Each direction is represented as a pair [row, col].
     * A knight can move in eight L-shaped directions.
     * @type {Array<[number, number]>}
     */
    this.directions = [
      [2, -1], // two up, one left
      [2, 1], // two up, one right
      [-2, -1], // two down, one left
      [-2, 1], // two down, one right
      [-1, 2], // one down, two right
      [1, 2], // one up, two right
      [-1, -2], // one down, two left
      [1, -2], // one up, two left
    ];

    /**
     * The value assigned to the knight for scoring purposes.
     * The value is a numeric score representing the piece's importance.
     * @type {number}
     */
    this.value = 3;
  }

  /**
   * Sets the possible moves for the knight based on its single moves.
   * @returns {Array<Object>} An array of possible move positions.
   */
  setPossibleMoves = () => {
    return singleMove(this);
  };
}
