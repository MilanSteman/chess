import { CastleAnnotation, CastlingType } from "../enums/Castling.js";
import { getPieceAbbr } from "./getPieceAbbr.js";
import { getTileFromPosition } from "./getTileFromPosition.js";
/**
 * Gets an annotation string e.g. 'Nxd4', 'Qxf5#' from a made move
 * @returns An annotation string of the made move
 */
function getAnnotationFromMove(move) {
    // Get first letter of piece or in case pawn, empty string
    const pieceAbbr = getPieceAbbr(move.piece.name, true).toUpperCase();
    // Check if move is castling (only move with special annotation)
    const castleType = move.specialMove &&
        (move.specialMove === CastlingType.SHORT ||
            move.specialMove === CastlingType.LONG)
        ? move.specialMove === CastlingType.SHORT
            ? CastleAnnotation.SHORT
            : CastleAnnotation.LONG
        : null;
    // Set annotation for piece to either the correct letter of castling
    const pieceAnnotation = castleType ? castleType : pieceAbbr;
    // Check if move has a capture
    const captureAnnotation = move.capture ? "x" : "";
    // Set position of the move
    const positionAnnotation = castleType
        ? ""
        : `${getTileFromPosition(move.toRow, move.toCol)}`;
    // Check if move has sets a check(mate)
    const checkAnnotation = move.checkmate ? "#" : move.check ? "+" : "";
    return `${pieceAnnotation}${captureAnnotation}${positionAnnotation}${checkAnnotation}`;
}
export { getAnnotationFromMove };
