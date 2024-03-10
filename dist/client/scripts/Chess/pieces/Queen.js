import { moveInDirection } from "../misc/moveInDirection.js";
import { PieceValue } from "../enums/PieceValue.js";
import { Piece } from "./Piece.js";
/**
 * Represents a queen chess piece
 */
class Queen extends Piece {
    constructor(name, color, row, col) {
        super(name, color, row, col);
        this.value = PieceValue.QUEEN;
    }
    /**
     * Calculates and returns an array of possible moves for the queen
     * The queen moves vertically, horizontally and diagonally across the chessboard
     */
    getPossibleMoves() {
        const directions = [
            [1, 1], // down-right
            [-1, 1], // up-right
            [-1, -1], // up-left
            [1, -1], // down-left
            [1, 0], // down
            [-1, 0], // up
            [0, 1], // right
            [0, -1], // left
        ];
        return moveInDirection(this.row, this.col, directions, true);
    }
}
export { Queen };
