import Piece from "./Piece.js";
import { repeatingMove } from "../misc/moveHelper.js";

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
   * @param {Game} game - The game instance the piece is part of.
   */
  constructor(position, player, color, name, game) {
    super(position, player, color, name, game);

    /**
     * Possible movement directions for a rook.
     * Each direction is represented as a pair [row, col].
     * A rook can move horizontally or vertically in any direction.
     * @type {Array<[number, number]>}
     */
    this.directions = [
      [1, 0], // right
      [-1, 0], // left
      [0, 1], // up
      [0, -1], // down
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
    return repeatingMove(this);
  };
}
