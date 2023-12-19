const hasOnlyKing = (pieces) => {
  return pieces.length === 1 && pieces[0].name === "king";
}

const hasKingAndPiece = (pieces, pieceName) => {
  return pieces.length === 2 &&
    pieces.some(piece => piece.name === "king") &&
    pieces.some(piece => piece.name === pieceName);
}

export const isInsufficientMaterial = (currentPieces, opponentPieces) => {
  const isCurrentPlayerInsufficient = hasOnlyKing(currentPieces) || hasKingAndPiece(currentPieces, "bishop") || hasKingAndPiece(currentPieces, "knight");
  const isOpponentPlayerInsufficient = hasOnlyKing(opponentPieces) || hasKingAndPiece(opponentPieces, "bishop") || hasKingAndPiece(opponentPieces, "knight");

  return isCurrentPlayerInsufficient && isOpponentPlayerInsufficient;
}