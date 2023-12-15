import Piece from "./Piece.js";

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
}