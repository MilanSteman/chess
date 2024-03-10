import { getAnnotationFromMove } from "../../misc/getAnnotationFromMove.js";
import { getTileFromPosition } from "../../misc/getTileFromPosition.js";
import { isInCheck } from "../../misc/isInCheck.js";
import { isPositionInBounds } from "../../misc/isPositionInBounds.js";
import { snapToTile } from "../../misc/snapToTile.js";
import { DEFAULT_TRANSLATE, translate } from "../../misc/translate.js";
import { CastleColDiff, CastlingType } from "../../enums/Castling.js";
import { GameEndTypes } from "../../enums/GameState.js";
import { PawnDirection } from "../../enums/PawnDirection.js";
import { Players } from "../../enums/Players.js";
import { Board } from "../../game/Board.js";
import { Game } from "../../game/Game.js";
import { MadeMove, PotentialMove } from "../../interfaces/Move.js";
import { Piece } from "../Piece.js";
import client from "../../../client.js";

interface Moveable {
  makeMove: (instance: Piece, newRow: number, newCol: number) => void;
  isMoveValid: (
    instance: Piece,
    move: PotentialMove | undefined,
    newRow: number,
    newCol: number,
  ) => boolean;
  handleCastling: (instance: Piece, move: PotentialMove) => Piece | null;
  handleEnPassant: (instance: Piece, move: PotentialMove) => Piece | null;
  handleTarget: (newRow: number, newCol: number) => Piece | null;
  updatePiecePosition: (
    instance: Piece,
    newRow: number,
    newCol: number,
  ) => void;
  isEnemyInCheckAfterMove: () => boolean;
  setMadeMove: (
    instance: Piece,
    move: PotentialMove,
    isCapture: Piece | null,
    castledPiece: Piece | null,
  ) => MadeMove;
  createMoveElement: (move: MadeMove) => void;
}

/**
 * Mixin used for all moveable aspects of the piece (excluding move generation)
 */
const MoveableMixin: Moveable = {
  /**
   * Executes a move for the piece on the chessboard
   */
  makeMove(instance: Piece, newRow: number, newCol: number): void {
    // Check if the made move is among the legal moves.
    const legalMove: PotentialMove | undefined = instance
      .getLegalMoves()
      .find((move) => move.row === newRow && move.col === newCol);

    if (!this.isMoveValid(instance, legalMove, newRow, newCol)) {
      const illegalAudio = new Audio("/audio/illegal.mp3");
      illegalAudio.play();
      return snapToTile(instance, instance.row, instance.col);
    }

    if (legalMove) {
      // Get castled piece
      const castledPiece: Piece | null =
        legalMove?.specialMove === CastlingType.LONG ||
        legalMove?.specialMove === CastlingType.SHORT
          ? this.handleCastling(instance, legalMove)
          : null;

      // Check if it is an capture and handle accordingly
      const isCapture: Piece | null =
        legalMove?.specialMove === "en-passant"
          ? this.handleEnPassant(instance, legalMove)
          : this.handleTarget(newRow, newCol);

      let madeMove: MadeMove = this.setMadeMove(
        instance,
        legalMove,
        isCapture,
        castledPiece,
      );

      // Update the position of the piece on the chessboard
      this.updatePiecePosition(instance, newRow, newCol);

      // Checks whether a move is a check
      madeMove = { ...madeMove, ...{ check: this.isEnemyInCheckAfterMove() } };

      // Highlight the to- and from tile
      Board.highlightMovePositions(madeMove);

      // Switch to the next player's turn
      // This is done before setting the mademove to add correct checkmate handling
      Game.switchCurrentPlayer();

      // Check checkmate on move after handling switch of player
      madeMove = {
        ...madeMove,
        ...{ checkmate: Game.state.endType === GameEndTypes.CHECKMATE },
      };

      // Push the made move to the player's moves
      if (Game.currentPlayer) {
        Game.currentPlayer.madeMoves = [
          ...Game.currentPlayer.madeMoves,
          madeMove,
        ];
      }

      // Creates the move element
      this.createMoveElement(madeMove);

      // Mark the piece as moved
      instance.hasMoved = true;

      const { fromRow, fromCol, toRow, toCol } = madeMove;

      // Play the correct audio
      if (madeMove.check) {
        const checkAudio = new Audio("/audio/check.mp3");
        checkAudio.play();
      } else if (madeMove.capture) {
        const captureAudio = new Audio("/audio/capture.mp3");
        captureAudio.play();
      } else if (madeMove.specialMove && castledPiece) {
        const castleAudio = new Audio("/audio/castle.mp3");
        castleAudio.play();
      } else {
        const moveAudio = new Audio("/audio/move.mp3");
        moveAudio.play();
      }

      // Update move properties
      Game.move++;
      Board.currentIndex = Game.move - 1;

      // Emit the move to the socket so that the other player will also see the move
      client.socket.emit(
        "move",
        { fromRow, fromCol, toRow, toCol },
        Game.currentPlayer?.color,
      );
    }
  },

  /**
   * Checks if a move is valid based on various conditions
   * @returns True if the move is valid, otherwise false
   */
  isMoveValid(
    instance: Piece,
    move: PotentialMove | undefined,
    newRow: number,
    newCol: number,
  ): boolean {
    const isCurrentPlayerTurn = instance.color === Game.currentPlayer?.color;
    const isMoveInBounds = isPositionInBounds(newRow, newCol, Board.SIZE);
    const isSamePosition = instance.row === newRow && instance.col === newCol;
    const isMoveLegal = move !== undefined;

    return (
      isCurrentPlayerTurn && isMoveInBounds && !isSamePosition && isMoveLegal
    );
  },

  /**
   * Handles castling
   * @returns The 'castled' rook
   */
  handleCastling(instance: Piece, move: PotentialMove): Piece | null {
    const TRANSLATE_VAL: number = 100;
    let castlingRook: Piece | null;
    let colDiff: number;

    switch (move.specialMove) {
      case "shortCastle":
        colDiff = CastleColDiff.SHORT;

        // Set rook in the correct tile
        castlingRook = Board.grid[instance.row][Board.COL_SIZE - 1];
        break;

      case "longCastle":
        colDiff = CastleColDiff.LONG;

        // Set rook in the correct tile
        castlingRook = Board.grid[instance.row][0];
        break;

      default:
        // Handle other special moves or an unknown specialMove value
        console.log(`Unknown special move: ${move.specialMove}`);
        return null;
    }

    // Translate the rook to its destination
    translate(
      castlingRook?.pieceDomEl,
      DEFAULT_TRANSLATE,
      colDiff * TRANSLATE_VAL,
    );

    // Asynchronously revert the move after a delay to simulate the original move speed
    setTimeout(() => {
      translate(castlingRook?.pieceDomEl, DEFAULT_TRANSLATE, DEFAULT_TRANSLATE);
      castlingRook?.MoveableMixin.updatePiecePosition(
        castlingRook,
        castlingRook.row,
        castlingRook.col + colDiff,
      );
    }, Game.moveSpeed);

    return castlingRook;
  },

  /**
   * Handles en-passant
   * @returns The captured 'en-passant' pawn
   */
  handleEnPassant(instance: Piece, move: PotentialMove): Piece | null {
    const direction: number =
      instance.color === Players.WHITE
        ? PawnDirection.BLACK
        : PawnDirection.WHITE;
    const targetRow = move.row - 1 * direction;

    return this.handleTarget(targetRow, move.col);
  },

  /**
   * Handles the target tile after the piece has moved
   * Removes the DOM element of any piece present on the target tile
   */
  handleTarget(newRow: number, newCol: number): Piece | null {
    const target: Piece | null = Board.grid[newRow][newCol];

    if (!target) {
      return null;
    }

    // Remove DOM element from the board
    target.pieceDomEl.classList.add("captured");

    // Add target to the capture array of the current player
    if (Game.currentPlayer) {
      Game.currentPlayer.captures = [...Game.currentPlayer.captures, target];
    }

    return target;
  },

  /**
   * Updates the position of the piece on the chessboard after a move
   */
  updatePiecePosition(instance: Piece, newRow: number, newCol: number): void {
    // Remove the piece from its original position on the grid
    Board.grid[instance.row][instance.col] = null;

    // Set the piece in its new position on the grid
    Board.grid[newRow][newCol] = instance;

    // Update the row and column properties of the piece
    instance.row = newRow;
    instance.col = newCol;

    // Append the piece to its new parent tile on the chessboard
    instance.parentDomEl = document.querySelector(
      `div.tile[data-tile="${getTileFromPosition(newRow, newCol)}"]`,
    ) as HTMLElement;
    instance.parentDomEl.appendChild(instance.pieceDomEl);

    // Snap the piece to its new position on the tile
    snapToTile(instance, instance.row, instance.col);
  },

  /**
   * Checks if a move has set the enemy king in check
   * @returns An boolean that determines whether the move has resulted in a check
   */
  isEnemyInCheckAfterMove(): boolean {
    return isInCheck(Game.getOpponent());
  },

  /**
   * Sets the move made based on the MadeMove interface
   * @returns An object of a made move
   */
  setMadeMove(
    instance: Piece,
    move: PotentialMove,
    isCapture: Piece | null,
    castledPiece: Piece | null,
  ): MadeMove {
    return {
      piece: instance,
      fromRow: instance.row,
      fromCol: instance.col,
      toRow: move?.row,
      toCol: move?.col,
      capture: isCapture,
      check: null,
      checkmate: null,
      specialMove: move?.specialMove ?? undefined,
      castledPiece: castledPiece,
    };
  },

  /**
   * Creates the move element in the move list
   */
  createMoveElement(move: MadeMove): void {
    const moveStr: string = getAnnotationFromMove(move);
    const moveListEl: HTMLDivElement | null =
      document.querySelector(".side > .list");

    if (!moveListEl || !moveStr) {
      return;
    }

    // Create a new row (turn) if the player is white.
    if (move.piece.color === Players.WHITE) {
      const turnElement: HTMLDivElement = document.createElement("div");
      turnElement.classList.add("turn");
      moveListEl.append(turnElement);

      // Automatically scroll to the bottom
      moveListEl.scrollTop = moveListEl.scrollHeight;
    }

    // Delete all previously selected moves
    document.querySelectorAll(".turn > span").forEach((spanEl) => {
      spanEl.classList.remove("selected");
    });

    // Create a move element
    const moveIndex = Game.move;
    const moveElement: HTMLSpanElement = document.createElement("span");
    moveElement.setAttribute("data-move", moveIndex.toString());
    moveElement.textContent = moveStr;
    moveElement.classList.add("selected");
    moveElement.addEventListener("click", () =>
      Board.revertBoardState(moveIndex),
    );

    // Get the latest turn element and append the move to it.
    (moveListEl.lastChild as HTMLDivElement).appendChild(moveElement);
  },
};

export { Moveable, MoveableMixin };
