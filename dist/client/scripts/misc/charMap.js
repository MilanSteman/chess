import { Bishop } from "../Chess/pieces/Bishop.js";
import { King } from "../Chess/pieces/King.js";
import { Knight } from "../Chess/pieces/Knight.js";
import { Pawn } from "../Chess/pieces/Pawn.js";
import { Queen } from "../Chess/pieces/Queen.js";
import { Rook } from "../Chess/pieces/Rook.js";
/**
 * A map that maps the abbreviation of a piece (commonly used in a FEN string for example) to a Piece subclass.
 */
const charMap = new Map([
  ["b", Bishop],
  ["k", King],
  ["n", Knight],
  ["p", Pawn],
  ["q", Queen],
  ["r", Rook],
]);
export { charMap };
