import Piece from "./Piece.js";
import { singleMove } from "../misc/moveHelper.js";

export default class Knight extends Piece {
  constructor(position, player, name) {
    super(position, player, name);
    this.directions = [
      [2, -1],
      [2, 1],
      [-2, -1],
      [-2, 1],
      [-1, 2],
      [1, 2],
      [-1, -2],
      [1, -2],
    ];
  }

  setPossibleMoves = () => {
    return singleMove(this.position, this.player, this.directions);
  }
}