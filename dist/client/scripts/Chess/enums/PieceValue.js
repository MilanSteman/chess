/**
 * Enum for determining the value of pieces
 */
var PieceValue;
(function (PieceValue) {
    PieceValue[PieceValue["BISHOP"] = 3] = "BISHOP";
    PieceValue[PieceValue["KING"] = 9] = "KING";
    PieceValue[PieceValue["KNIGHT"] = 3] = "KNIGHT";
    PieceValue[PieceValue["PAWN"] = 1] = "PAWN";
    PieceValue[PieceValue["QUEEN"] = 9] = "QUEEN";
    PieceValue[PieceValue["ROOK"] = 5] = "ROOK";
})(PieceValue || (PieceValue = {}));
export { PieceValue };
