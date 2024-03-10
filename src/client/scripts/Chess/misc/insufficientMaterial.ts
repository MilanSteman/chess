import { Piece } from "../pieces/Piece";

function hasOnlyKing(pieces: Piece[] | null): boolean {
  return pieces?.length === 1 && pieces[0].name === "king";
}

function hasKingAndPiece(pieces: Piece[] | null, pieceName: string): boolean {
  return (
    pieces?.length === 2 &&
    pieces.some((piece) => piece.name === "king") &&
    pieces.some((piece) => piece.name === pieceName)
  );
}

function hasInsufficientMaterial(
  currentPlayerPieces: Piece[] | null,
  opponentPlayerPieces: Piece[] | null,
): boolean {
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
