import Bishop from "../Pieces/Bishop.js";
import King from "../Pieces/King.js";
import Knight from "../Pieces/Knight.js";
import Pawn from "../Pieces/Pawn.js";
import Queen from "../Pieces/Queen.js";
import Rook from "../Pieces/Rook.js";

export default new Map([
  ["r", { Piece: Rook, player: "black" }],
  ["n", { Piece: Knight, player: "black" }],
  ["b", { Piece: Bishop, player: "black" }],
  ["q", { Piece: Queen, player: "black" }],
  ["k", { Piece: King, player: "black" }],
  ["p", { Piece: Pawn, player: "black" }],
  ["R", { Piece: Rook, player: "white" }],
  ["N", { Piece: Knight, player: "white" }],
  ["B", { Piece: Bishop, player: "white" }],
  ["Q", { Piece: Queen, player: "white" }],
  ["K", { Piece: King, player: "white" }],
  ["P", { Piece: Pawn, player: "white" }],
]);