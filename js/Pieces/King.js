import Piece from "./Piece.js";
import { singleMove } from "../misc/moveHelper.js";

export default class King extends Piece {
  constructor(position, player, name) {
    super(position, player, name);
    this.directions = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
  }

  setPossibleMoves = () => {
    return singleMove(this.position, this.player, this.directions);
  }
}