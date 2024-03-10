import { Board } from "../Chess/game/Board.js";
import { Game } from "../Chess/game/Game.js";
import {
  findAllPiecesFromPlayer,
  findSingleInstanceofPiece,
} from "./findPieceFromGrid.js";
/**
 * Checks if the current player's king is in check.
 * @returns True if the current player's king is in check, otherwise false.
 */
function isInCheck(player) {
  const currentPlayerKing = findSingleInstanceofPiece(
    Board.grid,
    "king",
    player.color,
  );
  const opponentPieces = findAllPiecesFromPlayer(
    Board.grid,
    Game.getOpponent(player).color,
  );
  // If the current player's king or opponent's pieces are not found, return false
  if (!currentPlayerKing || !opponentPieces) {
    return false;
  }
  // Check if any of the opponent's pieces have a possible move to the current player's king's position
  return opponentPieces.some((opponentPiece) =>
    (opponentPiece.getPossibleMoves() || []).some(
      (opponentMove) =>
        opponentMove.row === currentPlayerKing.row &&
        opponentMove.col === currentPlayerKing.col,
    ),
  );
}
/**
 * Checks if the move to the new position would put the king in check
 * @returns True if the move results in the king being in check, otherwise false
 */
function isInCheckAfterMove(instance, newRow, newCol) {
  // Create a deep copy of the current board state
  const copiedGrid = Board.grid.map((inner) => [...inner]);
  // Store the original state of the piece
  const originalPiece = Object.assign({}, instance);
  // Remove the piece from its original position on the grid
  Board.grid[instance.row][instance.col] = null;
  // Move the piece to the new position on the grid
  instance.row = newRow;
  instance.col = newCol;
  Board.grid[newRow][newCol] = instance;
  // Check if the move puts the king in check
  const isCheck = isInCheck(Game.currentPlayer);
  // Restore the original state of the piece and the board
  Object.assign(instance, originalPiece);
  Board.grid = copiedGrid;
  return isCheck;
}
export { isInCheckAfterMove, isInCheck };
