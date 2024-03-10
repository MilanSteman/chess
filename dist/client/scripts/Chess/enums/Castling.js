/**
 * Enum for determining the types of castling
 */
var CastlingType;
(function (CastlingType) {
    CastlingType["SHORT"] = "shortCastle";
    CastlingType["LONG"] = "longCastle";
})(CastlingType || (CastlingType = {}));
var CastleAnnotation;
(function (CastleAnnotation) {
    CastleAnnotation["SHORT"] = "O-O";
    CastleAnnotation["LONG"] = "O-O-O";
})(CastleAnnotation || (CastleAnnotation = {}));
var CastleColDiff;
(function (CastleColDiff) {
    CastleColDiff[CastleColDiff["SHORT"] = -2] = "SHORT";
    CastleColDiff[CastleColDiff["LONG"] = 3] = "LONG";
})(CastleColDiff || (CastleColDiff = {}));
export { CastlingType, CastleAnnotation, CastleColDiff };
