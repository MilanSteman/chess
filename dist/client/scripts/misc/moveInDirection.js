import { Board } from "../Chess/game/Board.js";
import { isPositionInBounds } from "./isPositionInBounds.js";
/**
 * Returns all moves based on directions a piece can go
 * @returns All theoretical possible moves a piece can make, not taking into account the game state (e.g. in check, x-ray)
 */
function moveInDirection(row, col, directions, isRepeating) {
    const possibleMoves = [];
    const selectedPiece = Board.grid[row][col];
    // Loop through each possible direction
    for (const [x, y] of directions) {
        let newRow = row;
        let newCol = col;
        // Update the position until a boundary is reached
        do {
            newRow += x;
            newCol += y;
            if (isPositionInBounds(newRow, newCol)) {
                const targetPiece = Board.grid[newRow][newCol];
                if (targetPiece) {
                    // If a tile is occupied by an enemy piece, add the tile to the list of possible moves.
                    if ((selectedPiece === null || selectedPiece === void 0 ? void 0 : selectedPiece.color) !== targetPiece.color) {
                        possibleMoves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
                // If a tile is empty, add the tile to the list of possible moves.
                possibleMoves.push({ row: newRow, col: newCol });
            }
        } while (isRepeating && isPositionInBounds(newRow, newCol));
    }
    return possibleMoves;
}
export { moveInDirection };
