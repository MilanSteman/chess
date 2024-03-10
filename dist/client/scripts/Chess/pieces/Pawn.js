import { isPositionInBounds } from "../misc/isPositionInBounds.js";
import { Board } from "../game/Board.js";
import { PieceValue } from "../enums/PieceValue.js";
import { Players } from "../enums/Players.js";
import { Piece } from "./Piece.js";
import { Game } from "../game/Game.js";
import { EnPassantRow } from "../enums/EnPassantRow.js";
import { PawnDirection } from "../enums/PawnDirection.js";
/**
 * Represents a pawn chess piece
 */
class Pawn extends Piece {
    constructor(name, color, row, col) {
        super(name, color, row, col);
        this.value = PieceValue.PAWN;
        // Set the direction based on the color of the pawn
        this.direction = this.color === Players.WHITE ? PawnDirection.BLACK : PawnDirection.WHITE;
        this.enPassantRow = this.color === Players.WHITE ? EnPassantRow.WHITE : EnPassantRow.BLACK;
    }
    /**
     * Calculates and returns an array of possible moves for the pawn
     * @returns An array of possible moves (row and col pairs) for the pawn
     */
    getPossibleMoves() {
        const moves = [];
        // Add all possible moves to the moves array
        this.forwardMoves(moves);
        this.captureMoves(moves);
        this.enPassantMoves(moves);
        return moves;
    }
    /**
     * Calculates and adds forward moves to the provided array of moves
     * Takes into account the pawn's initial two-square move and obstacles in its path
     * @param moves - The array to store the calculated moves
     */
    forwardMoves(moves) {
        // Check how many tiles the pawn can move (1 or 2 depending on whether it has moved)
        const distance = !this.hasMoved ? 2 : 1;
        for (let i = 1; i <= distance; i++) {
            // Calculate new move position
            const newRow = this.row + i * this.direction;
            // Check if the new position is within the bounds of the chessboard
            if (isPositionInBounds(newRow, this.col)) {
                const targetPiece = Board.grid[newRow][this.col];
                // Break the loop if there is a piece in the path (a piece can't move through other pieces)
                if (targetPiece) {
                    break;
                }
                // Add the forward move to the array of moves
                moves.push({ row: newRow, col: this.col });
            }
        }
    }
    /**
     * Calculates and adds capture moves to the provided array of moves
     * Takes into account diagonal capture moves for the pawn
     * @param moves - The array to store the calculated moves
     */
    captureMoves(moves) {
        for (const [x, y] of [[this.direction, -1], [this.direction, 1]]) {
            // Calculate new move position
            const newRow = this.row + x;
            const newCol = this.col + y;
            // Check if the new position is within the bounds of the chessboard
            if (isPositionInBounds(newRow, newCol)) {
                const targetPiece = Board.grid[newRow][newCol];
                // Add the capture move to the array of moves if there is an opponent's piece to capture
                if (targetPiece && this.color !== targetPiece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }
    }
    /**
     * Calculates and adds en passant moves to the provided array of moves
     * Takes into account the possibility of an en passant capture move for the pawn
     */
    enPassantMoves(moves) {
        // Check if the pawn is in the en passant row
        if (this.row !== this.enPassantRow) {
            return;
        }
        // Get the opponent player
        const opponent = Game.getOpponent();
        // Get the opponent's last move
        const opponentLastMove = opponent.madeMoves[opponent.madeMoves.length - 1];
        // Check if en passant is possible based on the opponent's last move
        if (!this.canEnPassant(opponentLastMove)) {
            return;
        }
        // Calculate the en passant move position
        const enPassantMove = {
            row: opponentLastMove.toRow + this.direction,
            col: opponentLastMove.toCol,
            specialMove: 'en-passant',
        };
        // Add the en passant move to the array of moves
        moves.push(enPassantMove);
    }
    /**
     * Checks if en passant capture is possible based on the opponent's last move
     * @returns True if en passant capture is possible, false otherwise
     */
    canEnPassant(lastMove) {
        // Check if the target piece in the last move is a pawn
        const isTargetPawn = lastMove.piece.name === "pawn";
        // Check if the target pawn is on the same row as the current pawn
        const isTargetOnRow = lastMove.toRow === this.row;
        // Check if the target pawn is next to the current pawn (horizontally)
        const isTargetNextToThis = Math.abs(lastMove.toCol - this.col) === 1;
        // Check if the target pawn moved two squares forward in its last move
        const hasTargetMovedTwoSquares = Math.abs(lastMove.toRow - lastMove.fromRow) === 2;
        return isTargetPawn && isTargetOnRow && isTargetNextToThis && hasTargetMovedTwoSquares;
    }
}
export { Pawn };
