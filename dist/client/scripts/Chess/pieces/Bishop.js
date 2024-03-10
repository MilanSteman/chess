import { moveInDirection } from "../misc/moveInDirection.js";
import { PieceValue } from "../enums/PieceValue.js";
import { Piece } from "./Piece.js";
/**
 * Represents a bishop chess piece
 */
class Bishop extends Piece {
    constructor(name, color, row, col) {
        super(name, color, row, col);
        this.value = PieceValue.BISHOP;
    }
    /**
     * Calculates and returns an array of possible moves for the bishop
     * The bishop moves diagonally across the chessboard
     */
    getPossibleMoves() {
        const directions = [
            [1, 1], // down-right
            [-1, 1], // up-right
            [-1, -1], // up-left
            [1, -1], // down-left
        ];
        return moveInDirection(this.row, this.col, directions, true);
    }
}
export { Bishop };
