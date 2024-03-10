import { getTileFromPosition } from "../misc/getTileFromPosition.js";
import { Players } from "../enums/Players.js";
import { PotentialMove } from "../interfaces/Move.js";
import { DraggableMixin } from "./mixins/Draggable.js";
import { isInCheckAfterMove } from "../misc/isInCheck.js";
import { Moveable, MoveableMixin } from "./mixins/Movable.js";
import { getPieceAbbr } from "../misc/getPieceAbbr.js";
import { Game } from "../game/Game.js";

/**
 * Represents a piece
 */
abstract class Piece {
  public static readonly Z_INDEX: { DEFAULT: string, DRAGGED: string } = {
    DEFAULT: "1",
    DRAGGED: "10"
  };
  public static readonly OFFSET: number = 0.5;
  public MoveableMixin: Moveable = Object.assign({}, MoveableMixin);

  public readonly name: string;
  public readonly color: string;
  public row: number;
  public col: number;
  public parentDomEl: HTMLElement | null = null;
  public pieceDomEl: HTMLImageElement;
  public isDragging: boolean = false;
  public hasMoved: boolean;
  public value: number;

  constructor(name: string, color: Players, row: number, col: number) {
    this.name = name;
    this.color = color;
    this.row = row;
    this.col = col;
    this.value = 0;
    this.hasMoved = false;
    this.parentDomEl = document.querySelector(`div.tile[data-tile="${getTileFromPosition(this.row, this.col)}"]`) as HTMLElement;
    this.pieceDomEl = document.createElement("img");
    this.hasMoved = false;

    // Mixins
    Object.assign(this, DraggableMixin, MoveableMixin);

    // Create the piece on the chessboard
    this.createPiece();
  }

  /**
   * Abstract method to be implemented by subclasses
   * Returns an array of possible moves for the piece
   */
  public abstract getPossibleMoves(): PotentialMove[];

  /**
   * Returns an array of legal moves for the piece
   * Filters out moves that would result in the player's king being in check
   */
  public getLegalMoves(): PotentialMove[] {
    return this.getPossibleMoves().filter(move => !isInCheckAfterMove(this, move.row, move.col));
  }

  /**
   * Creates the HTML element for the chess piece and sets its initial properties
   */
  private createPiece(): void {
    // Set properties
    this.pieceDomEl.src = `/images/${Game.pieceTheme}/${this.color.charAt(0)}${getPieceAbbr(this.name)}.png`;
    this.pieceDomEl.draggable = false;

    // Add mousedown event listener to start dragging
    this.pieceDomEl.addEventListener("mousedown", () => DraggableMixin.handleDrag(this));

    // Append the piece to its parent tile on the chessboard
    this.parentDomEl?.appendChild(this.pieceDomEl);
  }
}

export { Piece };
