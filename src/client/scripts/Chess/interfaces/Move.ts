import { Piece } from "../pieces/Piece";

/**
 * Interface for a potential (not-made) move
 */
interface PotentialMove {
  row: number;
  col: number;
  specialMove?: string;
}

/**
 * Interface for a made move
 */
interface MadeMove {
  piece: Piece;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  capture: Piece | null;
  check: boolean | null;
  checkmate: boolean | null;
  specialMove?: string;
  castledPiece?: Piece | null;
}

export { PotentialMove, MadeMove };