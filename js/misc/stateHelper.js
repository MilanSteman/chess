/**
 * Checks if a player has only a king in their pieces.
 * @param {Array<Piece>} pieces - The array of pieces to check.
 * @returns {boolean} True if the player has only a king, false otherwise.
 */
const hasOnlyKing = (pieces) => {
  return pieces.length === 1 && pieces[0].name === "king";
}

/**
 * Checks if a player has a king and a specific piece in their pieces.
 * @param {Array<Piece>} pieces - The array of pieces to check.
 * @param {string} pieceName - The name of the piece to check for.
 * @returns {boolean} True if the player has a king and the specified piece, false otherwise.
 */
const hasKingAndPiece = (pieces, pieceName) => {
  return pieces.length === 2 &&
    pieces.some(piece => piece.name === "king") &&
    pieces.some(piece => piece.name === pieceName);
}

/**
 * Checks if there is insufficient material on the board for both players.
 * @param {Array<Piece>} currentPieces - The array of pieces for the current player.
 * @param {Array<Piece>} opponentPieces - The array of pieces for the opponent player.
 * @returns {boolean} True if both players have insufficient material, false otherwise.
 */
export const isInsufficientMaterial = (currentPieces, opponentPieces) => {
  const isCurrentPlayerInsufficient = hasOnlyKing(currentPieces) || hasKingAndPiece(currentPieces, "bishop") || hasKingAndPiece(currentPieces, "knight");
  const isOpponentPlayerInsufficient = hasOnlyKing(opponentPieces) || hasKingAndPiece(opponentPieces, "bishop") || hasKingAndPiece(opponentPieces, "knight");

  return isCurrentPlayerInsufficient && isOpponentPlayerInsufficient;
}