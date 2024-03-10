import { getTileFromPosition } from "../../misc/getTileFromPosition.js";
import { Game } from "../../game/Game.js";
import { Board } from "../../game/Board.js";
import { Piece } from "../Piece.js";
import { clamp } from "../../misc/clamp.js";
import { Players } from "../../enums/Players.js";
/**
 * Mixin used for all draggable aspects of the piece
 */
const DraggableMixin = {
    /**
     * Handler for the dragging of a piece. Used to avoid duplication when dragging a single element multiple times
     */
    dragPieceHandler: () => { },
    /**
     * Handler for stopping the dragging of a piece. Used to avoid duplication when dragging a single element multiple times
     */
    stopDraggingHandler: () => { },
    /**
     * Handles on drag functionalities of a piece
     * @param instance Piece
     */
    handleDrag(instance) {
        const illegalAudio = new Audio("/audio/illegal.mp3");
        if (!Game.allowMovements) {
            illegalAudio.play();
            return Board.revertBoardState();
        }
        if (!Game.currentPlayer || instance.color !== Game.currentPlayer.color || Game.player !== instance.color) {
            illegalAudio.play();
            return;
        }
        // Assign a visual for each possible move
        const moves = instance.getLegalMoves();
        moves.forEach(({ row, col }) => {
            const targetPiece = Board.grid[row][col];
            const tileDomEl = document.querySelector(`div.tile[data-tile="${getTileFromPosition(row, col)}"]`);
            // Set the correct visual based on if there is a piece that can be captured
            tileDomEl === null || tileDomEl === void 0 ? void 0 : tileDomEl.classList.add(targetPiece && instance.color !== targetPiece.color ? "attacked-piece" : "attacked-tile");
        });
        // Set properties
        instance.isDragging = true;
        instance.pieceDomEl.style.zIndex = Piece.Z_INDEX.DRAGGED;
        // Store references to the same functions for adding and removing listeners
        this.dragPieceHandler = (e) => this.dragPiece(instance, e);
        this.stopDraggingHandler = (e) => this.stopDragging(instance, e);
        // Add eventlisteners based on the references above (this will make the removable after to avoid duplication)
        document.addEventListener("mousemove", this.dragPieceHandler);
        document.addEventListener("mouseup", this.stopDraggingHandler);
    },
    /**
     * Handles the calculations when dragging a piece
     */
    dragPiece(instance, e) {
        if (!instance.isDragging) {
            return;
        }
        // Calculate the new tile
        const { x, y } = this.calculateNewPosition(instance, e);
        const { newRow, newCol } = this.calculateTile(instance, x, y);
        // Set hovered tile
        Board.hoveredTile = document.querySelector(`div.tile[data-tile="${getTileFromPosition(newRow, newCol)}"]`);
        // Get size of the piece element
        const { width, height } = instance.pieceDomEl.getBoundingClientRect();
        // Calculate percentages for left and top styles
        let leftPercentage = (x / width) * (100 / Board.COL_SIZE);
        let topPercentage = (y / height) * (100 / Board.ROW_SIZE);
        if (Game.player === Players.BLACK) {
            leftPercentage = (100 - leftPercentage) - (100 / Board.COL_SIZE);
            topPercentage = (100 - topPercentage) - (100 / Board.ROW_SIZE);
        }
        // Set styles
        instance.pieceDomEl.style.left = `${leftPercentage}%`;
        instance.pieceDomEl.style.top = `${topPercentage}%`;
    },
    /**
     * Handles the events when the dragging of a piece stops
     */
    stopDragging(instance, e) {
        // Calculate the new tile
        const { x, y } = this.calculateNewPosition(instance, e);
        const { newRow, newCol } = this.calculateTile(instance, x, y);
        // Make the move
        instance.MoveableMixin.makeMove(instance, newRow, newCol);
        // Set variables back to default
        instance.isDragging = false;
        Board.hoveredTile = null;
        // Remove all attacked tile squares
        document.querySelectorAll("div.tile").forEach((tile) => {
            tile.classList.remove("attacked-tile", "attacked-piece");
        });
        // Remove the event listeners with references to the same functions
        document.removeEventListener("mousemove", this.dragPieceHandler);
        document.removeEventListener("mouseup", this.stopDraggingHandler);
    },
    /**
     * Calculates the position of a piece relative to the board
     * @returns The x- and y coordinates relative to the board
     */
    calculateNewPosition(instance, e) {
        const pieceRect = instance.pieceDomEl.getBoundingClientRect();
        const boardRect = Board.boardDomEl.getBoundingClientRect();
        const xValue = (e.clientX - pieceRect.width / 2 - boardRect.left + window.scrollX);
        const yValue = (e.clientY - pieceRect.height / 2 - boardRect.top + window.scrollY);
        const xMin = (-pieceRect.width / 2);
        const yMin = (-pieceRect.height / 2);
        const xMax = (boardRect.width - pieceRect.width / 2);
        const yMax = (boardRect.height - pieceRect.height / 2);
        let x = clamp(xValue, xMin, xMax);
        let y = clamp(yValue, yMin, yMax);
        if (Game.player === Players.BLACK) {
            x = (xMax - x) + xMin;
            y = (yMax - y) + yMin;
        }
        return { x, y };
    },
    /**
     * Calculates the tile based on a set of coordinates
     * @returns The new row and -col
     */
    calculateTile(instance, x, y) {
        let newRow = Math.floor(y / instance.pieceDomEl.getBoundingClientRect().height + Piece.OFFSET);
        let newCol = Math.floor(x / instance.pieceDomEl.getBoundingClientRect().width + Piece.OFFSET);
        return {
            newRow,
            newCol
        };
    },
};
export { DraggableMixin };
