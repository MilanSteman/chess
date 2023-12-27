import Piece from './Piece.js';
import { repeatingMove } from '../misc/moveHelper.js';

/**
 * Represents a Rook chess piece.
 * @extends Piece
 */
export default class Rook extends Piece {
  /**
   * Creates a new Rook chess piece.
   * @constructor
   * @param {Object} position - The initial position of the piece on the board.
   * @param {Player} player - The player to whom the piece belongs.
   * @param {string} color - The color of the piece (e.g., 'white' or 'black').
   * @param {string} name - The name of the piece (e.g., 'rook').
   */
  constructor(position, player, color, name) {
    super(position, player, color, name);

    /**
     * Possible movement directions for a rook.
     * Each direction is represented as a pair [row, col].
     * A rook can move horizontally or vertically in any direction.
     * @type {Array<[number, number]>}
     */
    this.directions = [
      [1, 0],     // horizontally right
      [-1, 0],    // horizontally left
      [0, 1],     // vertically up
      [0, -1],    // vertically down
    ];

    /**
     * The value assigned to the rook for scoring purposes.
     * The value is a numeric score representing the piece's importance.
     * @type {number}
     */
    this.value = 5;
  }

  /**
   * Sets the possible moves for the rook based on its repeating moves.
   * @returns {Array<Object>} An array of possible move positions.
   */
  setPossibleMoves = () => {
    return repeatingMove(this.position, this.player, this.directions);
  }
}
