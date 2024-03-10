import { moveInDirection } from "../misc/moveInDirection.js";
import { PieceValue } from "../enums/PieceValue.js";
import { Piece } from "./Piece.js";
/**
 * Represents a rook chess piece
 */
class Rook extends Piece {
    constructor(name, color, row, col) {
        super(name, color, row, col);
        this.value = PieceValue.ROOK;
    }
    /**
     * Calculates and returns an array of possible moves for the rook
     * The rook moves vertically or horizontally across the chessboard
     */
    getPossibleMoves() {
        const directions = [
            [1, 0], // down
            [-1, 0], // up
            [0, 1], // right
            [0, -1], // left
        ];
        return moveInDirection(this.row, this.col, directions, true);
    }
}
export { Rook };
