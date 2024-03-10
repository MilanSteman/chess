import { Players } from "../enums/Players.js";
import { Bishop } from "../pieces/Bishop.js";
import { King } from "../pieces/King.js";
import { Knight } from "../pieces/Knight.js";
import { Pawn } from "../pieces/Pawn.js";
import { Piece } from "../pieces/Piece.js";
import { Queen } from "../pieces/Queen.js";
import { Rook } from "../pieces/Rook.js";

/**
 * A map that maps the abbreviation of a piece (commonly used in a FEN string for example) to a Piece subclass.
 */
const charMap: Map<
  string,
  new (name: string, color: Players, row: number, col: number) => Piece
> = new Map([
  ["b", Bishop],
  ["k", King],
  ["n", Knight],
  ["p", Pawn],
  ["q", Queen],
  ["r", Rook],
]);

export { charMap };
