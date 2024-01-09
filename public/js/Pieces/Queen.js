import Piece from "./Piece.js";
import { repeatingMove } from "../misc/moveHelper.js";

/**
 * Represents a Queen chess piece.
 * @extends Piece
 */
export default class Queen extends Piece {
  /**
   * Creates a new Queen chess piece.
   * @constructor
   * @param {Object} position - The initial position of the piece on the board.
   * @param {Player} player - The player to whom the piece belongs.
   * @param {string} color - The color of the piece (e.g., 'white' or 'black').
   * @param {string} name - The name of the piece (e.g., 'queen').
   * @param {Game} game - The game instance the piece is part of.
   */
  constructor(position, player, color, name, game) {
    super(position, player, color, name, game);

    /**
     * Possible movement directions for a queen.
     * Each direction is represented as a pair [row, col].
     * A queen can move horizontally, vertically, or diagonally in any direction.
     * @type {Array<[number, number]>}
     */
    this.directions = [
      [1, 1], // up-right
      [-1, 1], // up-left
      [-1, -1], // down-left
      [1, -1], // down-right
      [1, 0], // right
      [-1, 0], // left
      [0, 1], // up
      [0, -1], // down
    ];

    /**
     * The value assigned to the queen for scoring purposes.
     * The value is a numeric score representing the piece's importance.
     * @type {number}
     */
    this.value = 9;
  }

  /**
   * Sets the possible moves for the queen based on its repeating moves.
   * @returns {Array<Object>} An array of possible move positions.
   */
  setPossibleMoves = () => {
    return repeatingMove(this);
  };
}
