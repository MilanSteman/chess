import gameInstance from "../Game/Game.js";
import {
  highlightPossibleMoves,
  clearAllVisuals,
} from "../misc/visualHelper.js";
import { getKing, isInCheckAfterMove } from "../misc/moveHelper.js";

/**
 * Represents a chess piece.
 */
export default class Piece {
  /**
   * Creates a new chess piece.
   * @constructor
   * @param {Object} position - The initial position of the piece on the board.
   * @param {Player} player - The player to whom the piece belongs.
   * @param {string} name - The name of the piece.
   */
  constructor(position, player, name) {
    /**
     * The position of the piece on the chessboard.
     * @type {Object}
     */
    this._position = position;

    /**
     * The player to whom the piece belongs.
     * @type {Player}
     */
    this.player = player;

    /**
     * The color of the piece, derived from the player's color.
     * @type {string}
     */
    this.color = this.player.color;

    /**
     * The name or type of the piece.
     * @type {string}
     */
    this.name = name;

    /**
     * Indicates whether the piece is currently selected on the board.
     * @type {boolean}
     */
    this.isSelected = false;

    /**
     * Indicates whether the piece has moved during the game.
     * @type {boolean}
     */
    this.hasMoved = false;

    // Initialize the DOM element and render movements
    const initializeDomElement = () => {
      const pieceDomElement = document.createElement("img");
      pieceDomElement.src = `public/images/pieces/${this.color}-${this.name}.png`;
      pieceDomElement.setAttribute("data-row", position.row);
      pieceDomElement.setAttribute("data-col", position.col);

      pieceDomElement.draggable = true;
      pieceDomElement.ondragstart = () => {
        renderMovements();
      };
      pieceDomElement.addEventListener("click", () => {
        renderMovements();
      });

      if (gameInstance.domElement) {
        gameInstance.domElement.appendChild(pieceDomElement);
      }

      /**
       * The DOM element representing the chess piece on the game board.
       * @type {HTMLElement}
       */
      this.domElement = document.querySelector(
        `img[data-row="${this.position.row}"][data-col="${this.position.col}"]`,
      );
    };

    // Handle movement rendering on interaction
    const renderMovements = () => {
      if (gameInstance.currentPlayer === this.player) {
        highlightPossibleMoves(this);
      }
    };

    // Call the initialization function
    initializeDomElement();
  }

  /**
   * Gets the current position of the piece.
   * @type {Object}
   */
  get position() {
    return this._position;
  }

  /**
   * Sets the position of the piece and updates the corresponding DOM element.
   * @param {Object} newPosition - The new position of the piece.
   */
  set position(newPosition) {
    this._position = newPosition;
    this.domElement.setAttribute("data-row", this._position.row);
    this.domElement.setAttribute("data-col", this._position.col);
  }

  /**
   * Abstract method to be overridden by child classes to set possible moves.
   */
  setPossibleMoves = () => {
    return false;
  };

  /**
   * Filters the possible moves to get legal moves (moves that do not result in check).
   * @returns {Array<Object>} An array of legal move positions.
   */
  setLegalMoves = () => {
    const moves = this.setPossibleMoves();
    const legalMoves = [];

    for (const move of moves) {
      // Check if the king is in check after every generated move, if it isn't, add it to the legal moves.
      if (!isInCheckAfterMove(this, move)) {
        legalMoves.push(move);
      }
    }

    return legalMoves;
  };

  /**
   * Moves the piece to the specified tile and handles capture, check, and promotion.
   * @param {Object} move - The target position for the move.
   */
  moveToTile = (move) => {
    let targetPiece = gameInstance.board.getPieceFromGrid(move);
    const isCapture = targetPiece !== null;
    let isCheck = false;

    const originalPiece = { ...this };

    // Handle the en-passant move
    if (move.case && move.case === "en-passant") {
      // Update the targetPiece so that it gets removed from the game.
      targetPiece = gameInstance.board.getPieceFromGrid({
        row: move.row - 1 * move.direction,
        col: move.col,
      });
    }

    // Handle the castle move
    if (move.case && move.case === "castle") {
      // Set the move based on a long or short castle.
      const rookDirection = move.type === "O-O-O" ? -1 : 1;
      const rookPosition = move.type === "O-O-O" ? 0 : 7;

      // Get the target rook.
      const castledRook = gameInstance.board.getPieceFromGrid({
        row: move.row,
        col: rookPosition,
      });

      // Set isCheck to true if the rook is attacking the opponent king after castling.
      isCheck = castledRook.makeMove({
        row: move.row,
        col: move.col - rookDirection,
      });

      this.makeMove(move);
    } else {
      // Set isCheck to the makeMove, this is put in the else, because castling is the only movement where two pieces move together.
      isCheck = this.makeMove(move);
    }

    // Remove a piece if it is captured in the move.
    if (targetPiece) {
      targetPiece.domElement.remove();
      targetPiece.player.pieces = targetPiece.player.pieces.filter(
        (piece) => piece !== targetPiece,
      );
      this.player.captures = [...this.player.captures, targetPiece];
    }

    // Handle the promotion of a pawn.
    if (move.case && move.case === "promotion") {
      // Set a timeout, so that the animation can play out smoothly.
      setTimeout(() => {
        // Get the queenChar based on the color (uppercase is white, lowercase is black).
        const queenChar = this.color === "white" ? "Q" : "q";

        // Remove the DOM Element of the moved piece.
        this.domElement.remove();

        // Filter out the moved piece, so that it gets removed from the game.
        this.player.pieces = this.player.pieces.filter(
          (piece) => piece !== this,
        );

        // Update the board with the new promoted queen.
        gameInstance.board.initializePieceInGrid(queenChar, {
          row: move.row,
          col: move.col,
        });
      }, 300);
    }

    // Switch current player after the move has been made.
    gameInstance.switchCurrentPlayer();

    // Log the data so that it can be displayed in the sidebar.
    const moveData = {
      piece: move.type ? move.type : this.name,
      toPosition: this.position,
      fromPosition: originalPiece._position,
      player: this.player,
      capture: isCapture,
      check: isCheck,
      checkmate: gameInstance.state.winType.checkmate,
    };

    this.player.moves = [...this.player.moves, moveData];

    // Clear any remaining visuals.
    clearAllVisuals();
  };

  /**
   * Moves the piece to the specified tile on the board.
   * @param {Object} move - The target position for the move.
   * @returns {boolean} True if the move results in check; otherwise, false.
   */
  makeMove = (move) => {
    const originalPiece = { ...this };
    let isCheck = false;

    // Update piece position on the board.
    this.position = move;

    // Update the board to make the move.
    gameInstance.board.setPieceFromGrid(this);
    gameInstance.board.removePieceFromGrid(originalPiece);

    // Update the piece properties.
    this.isSelected = false;
    this.hasMoved = true;

    // If the piece has legal moves, check if any of them result in a check.
    const legalMoves = this.setPossibleMoves();

    if (legalMoves) {
      const opponentKing = getKing(gameInstance.getOpponent());

      for (const move of legalMoves) {
        const { row, col } = move;

        if (
          row === opponentKing.position.row &&
          col === opponentKing.position.col
        ) {
          isCheck = true;
        }
      }
    }

    return isCheck;
  };
}
