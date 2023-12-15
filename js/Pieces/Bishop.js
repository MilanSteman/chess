import Piece from "./Piece.js";
import { repeatingMove } from "../misc/moveValidation.js";

export default class Bishop extends Piece {
  constructor(position, player, name) {
    super(position, player, name);
    this.directions = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ];
  }

  setPossibleMoves = () => {
    console.log(repeatingMove(this.position, this.player, this.directions));
  }
}