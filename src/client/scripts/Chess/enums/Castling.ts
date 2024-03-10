/**
 * Enum for determining the types of castling
 */
enum CastlingType {
  SHORT = "shortCastle",
  LONG = "longCastle",
}

enum CastleAnnotation {
  SHORT = "O-O",
  LONG = "O-O-O",
}

enum CastleColDiff {
  SHORT = -2,
  LONG = 3,
}

export { CastlingType, CastleAnnotation, CastleColDiff };
