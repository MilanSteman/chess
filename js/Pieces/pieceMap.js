import Bishop from "./Bishop.js";
import King from "./King.js";
import Knight from "./Knight.js";
import Pawn from "./Pawn.js";
import Queen from "./Queen.js";
import Rook from "./Rook.js";

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