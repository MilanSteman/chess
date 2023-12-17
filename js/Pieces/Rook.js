import Piece from "./Piece.js";
import { repeatingMove } from "../misc/moveHelper.js";

export default class Rook extends Piece {
  constructor(position, player, color, name) {
    super(position, player, color, name);
    this.directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
  }

  setPossibleMoves = () => {
    return repeatingMove(this.position, this.player, this.directions);
  }
}