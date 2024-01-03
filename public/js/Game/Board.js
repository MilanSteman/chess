import { charMap } from "../misc/pieceMap.js";
import gameInstance from "./Game.js";

/**
 * Represents a chessboard.
 * @class
 */
export default class Board {
  /**
   * Creates a new chessboard.
   * @constructor
   */
  constructor(size) {
    /**
     * The size of the chessboard.
     * @type {number}
     */
    this.size = size;

    /**
     * The 2D array representing the grid of the chessboard.
     * @type {Array<Array<null|Piece>>}
     */
    const createGrid = () => {
      return Array.from({ length: this.size }, () => {
        return Array.from({ length: this.size }).fill(null);
      });
    };

    // Set the grid to a two-dimensional array.
    this.grid = createGrid();
  }

  /**
   * Checks if a given position is within the bounds of the chessboard.
   * @param {{ row: number, col: number }} position - The position to check.
   * @returns {boolean} True if the position is within bounds, false otherwise.
   */
  isPositionInBounds = (position) => {
    const { row, col } = position;
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  };

  /**
   * Retrieves the piece at a given position on the chessboard.
   * @param {{ row: number, col: number }} position - The position to retrieve the piece from.
   * @returns {Piece|null} The piece at the specified position, or null if no piece is present.
   */
  getPieceFromGrid = (position) => {
    const { row, col } = position;
    return this.isPositionInBounds(position) && this.grid[row][col];
  };

  /**
   * Retrieves all pieces on the chessboard that belong to a specified player.
   * @param {string} filter - The color of the player ('white' or 'black').
   * @returns {Array<Piece>} An array of pieces belonging to the specified player.
   */
  getAllPiecesFromGrid = (filter = null) => {
    return this.grid.flatMap((row) =>
      row.filter((obj) => obj && (filter ? obj.color === filter : true)),
    );
  };

  /**
   * Sets a piece on the chessboard at the specified position.
   * @param {Piece} piece - The piece to set on the chessboard.
   * @returns {boolean} True if the piece is successfully set, false otherwise.
   */
  setPieceFromGrid = (piece) => {
    const { row, col } = piece._position;
    return (
      this.isPositionInBounds(piece._position) && (this.grid[row][col] = piece)
    );
  };

  /**
   * Removes a piece from the chessboard at the specified position.
   * @param {Piece} piece - The piece to remove from the chessboard.
   * @returns {boolean} True if the piece is successfully removed, false otherwise.
   */
  removePieceFromGrid = (piece) => {
    const { row, col } = piece._position;
    return (
      this.isPositionInBounds(piece._position) && (this.grid[row][col] = null)
    );
  };

  /**
   * Initializes a piece on the chessboard based on the provided FEN character and position.
   * @param {string} char - The FEN character representing the piece.
   * @param {{ row: number, col: number }} position - The position to initialize the piece.
   */
  initializePieceInGrid = (char, position) => {
    const { player, Piece } = charMap.get(char);
    const generatedPiece = new Piece(
      position,
      gameInstance.players[player],
      Piece.name.toLowerCase(),
    );

    gameInstance.players[player].pieces.push(generatedPiece);
    this.setPieceFromGrid(generatedPiece, gameInstance.board.grid);
  };

  /**
   * Sets up the chessboard with pieces based on the initial FEN string.
   */
  setPiecesFromFen = (string) => {
    // Split the fen string so that only the characters are used
    const rows = string.split(" ")[0].split("/").reverse();

    // Loop through each row (noted by the "/" in the string).
    rows.forEach((chars, row) => {
      let col = 0;

      // Loop through all characters in a row.
      [...chars].forEach((char) => {
        // If character is a number, skip that amount of steps.
        if (!isNaN(parseInt(char))) {
          col += parseInt(char);
        }

        // If character is a string, set a piece based on the charMap.
        if (charMap.has(char)) {
          const position = { row, col };
          this.initializePieceInGrid(char, position);
          col++;
        }
      });
    });
  };
}
