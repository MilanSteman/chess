function hasOnlyKing(pieces) {
  return (
    (pieces === null || pieces === void 0 ? void 0 : pieces.length) === 1 &&
    pieces[0].name === "king"
  );
}
function hasKingAndPiece(pieces, pieceName) {
  return (
    (pieces === null || pieces === void 0 ? void 0 : pieces.length) === 2 &&
    pieces.some((piece) => piece.name === "king") &&
    pieces.some((piece) => piece.name === pieceName)
  );
}
function hasInsufficientMaterial(currentPlayerPieces, opponentPlayerPieces) {
  const isCurrentPlayerInsufficient =
    hasOnlyKing(currentPlayerPieces) ||
    hasKingAndPiece(currentPlayerPieces, "bishop") ||
    hasKingAndPiece(currentPlayerPieces, "knight");
  const isOpponentPlayerInsufficient =
    hasOnlyKing(opponentPlayerPieces) ||
    hasKingAndPiece(opponentPlayerPieces, "bishop") ||
    hasKingAndPiece(opponentPlayerPieces, "knight");
  return isCurrentPlayerInsufficient && isOpponentPlayerInsufficient;
}
export { hasInsufficientMaterial };
