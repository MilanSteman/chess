import Piece from "./Piece.js";
import { repeatingMove } from "../misc/moveHelper.js";

export default class Bishop extends Piece {
  constructor(position, player, color, name) {
    super(position, player, color, name);
    this.directions = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ];
    this.value = 3;
  }

  setPossibleMoves = () => {
    return repeatingMove(this.position, this.player, this.directions);
  }
}