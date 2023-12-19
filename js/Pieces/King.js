import Piece from "./Piece.js";
import { isInCheckAfterMove, singleMove } from "../misc/moveHelper.js";
import gameInstance from "../Game/Game.js";

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
    this.value = 9;
  }

  setPossibleMoves = () => {
    const possibleMoves = singleMove(this.position, this.player, this.directions);

    this.castleMovement(possibleMoves);

    return possibleMoves;
  }

  castleMovement = (arr) => {
    if (!this.hasMoved && this.player) {
      const allyPieces = this.player.pieces;
      const allyRooks = allyPieces.filter((piece) => piece.name === "rook");

      allyRooks.forEach((allyRook) => {
        if (!allyRook.hasMoved) {
          const castleType = allyRook.position.col < this.position.col ? "O-O-O" : "O-O";
          const castleOffset = castleType === "O-O-O" ? -2 : 2;

          const colRange = {
            startCol: allyRook.position.col < this.position.col ? allyRook.position.col : this.position.col,
            endCol: allyRook.position.col < this.position.col ? this.position.col : allyRook.position.col,
          };

          for (let i = colRange.startCol + 1; i <= colRange.endCol - 1; i++) {
            const pieceBetween = gameInstance.board.getPieceFromGrid({ row: this.position.row, col: i });

            if (pieceBetween) {
              return false;
            }

            if (isInCheckAfterMove(this, { row: this.position.row, col: i })) {
              return false;
            }
          }

          const newPosition = { row: this.position.row, col: this.position.col + castleOffset, case: "castle", type: castleType }
          arr.push(newPosition);
        }
      });
    }
  }
}