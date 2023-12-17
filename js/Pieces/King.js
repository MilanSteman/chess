import Piece from "./Piece.js";
import { singleMove } from "../misc/moveHelper.js";

export default class King extends Piece {
  constructor(position, player, color, name) {
    super(position, player, color, name);
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
    const possibleMoves = singleMove(this.position, this.player, this.directions);

    return possibleMoves;
  }
}