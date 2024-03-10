import { getTileFromPosition } from "../misc/getTileFromPosition.js";
import { DraggableMixin } from "./mixins/Draggable.js";
import { isInCheckAfterMove } from "../misc/isInCheck.js";
import { MoveableMixin } from "./mixins/Movable.js";
import { getPieceAbbr } from "../misc/getPieceAbbr.js";
import { Game } from "../game/Game.js";
/**
 * Represents a piece
 */
class Piece {
    constructor(name, color, row, col) {
        this.MoveableMixin = Object.assign({}, MoveableMixin);
        this.parentDomEl = null;
        this.isDragging = false;
        this.name = name;
        this.color = color;
        this.row = row;
        this.col = col;
        this.value = 0;
        this.hasMoved = false;
        this.parentDomEl = document.querySelector(`div.tile[data-tile="${getTileFromPosition(this.row, this.col)}"]`);
        this.pieceDomEl = document.createElement("img");
        this.hasMoved = false;
        // Mixins
        Object.assign(this, DraggableMixin, MoveableMixin);
        // Create the piece on the chessboard
        this.createPiece();
    }
    /**
     * Returns an array of legal moves for the piece
     * Filters out moves that would result in the player's king being in check
     */
    getLegalMoves() {
        return this.getPossibleMoves().filter(move => !isInCheckAfterMove(this, move.row, move.col));
    }
    /**
     * Creates the HTML element for the chess piece and sets its initial properties
     */
    createPiece() {
        var _a;
        // Set properties
        this.pieceDomEl.src = `/images/${Game.pieceTheme}/${this.color.charAt(0)}${getPieceAbbr(this.name)}.png`;
        this.pieceDomEl.draggable = false;
        // Add mousedown event listener to start dragging
        this.pieceDomEl.addEventListener("mousedown", () => DraggableMixin.handleDrag(this));
        // Append the piece to its parent tile on the chessboard
        (_a = this.parentDomEl) === null || _a === void 0 ? void 0 : _a.appendChild(this.pieceDomEl);
    }
}
Piece.Z_INDEX = {
    DEFAULT: "1",
    DRAGGED: "10"
};
Piece.OFFSET = 0.5;
export { Piece };
