import gameInstance from "../Game/Game.js";
import Piece from "./Piece.js";

export default class Pawn extends Piece {
  constructor(position, player, color, name) {
    super(position, player, color, name);

    this.direction = this.color === "white" ? 1 : -1;
    this.enPassantRow = this.color === "white" ? 4 : 3;
    this.promotionRow = this.color === "white" ? 7 : 0;
  }

  setPossibleMoves = () => {
    const possibleMoves = [];

    this.forwardMovement(possibleMoves);
    this.captureMovement(possibleMoves);
    this.enPassantMovement(possibleMoves);

    return possibleMoves
  }

  forwardMovement = (arr) => {
    const maxDistance = !this.hasMoved ? 2 : 1;

    for (let i = 1; i <= maxDistance; i++) {
      let move = { row: this.position.row + i * this.direction, col: this.position.col };
      const targetPiece = gameInstance.board.getPieceFromGrid(move, gameInstance.board.grid);

      if (targetPiece) {
        break;
      }

      if (move.row === this.promotionRow) {
        move = { ...move, case: "promotion" };
      }

      arr.push(move);
    }
  }

  captureMovement = (arr) => {
    for (const [x, y] of [[this.direction, -1], [this.direction, 1]]) {
      let move = { row: this.position.row + x, col: this.position.col + y };

      if (gameInstance.board.isPositionInBounds(move)) {
        const targetPiece = gameInstance.board.getPieceFromGrid(move, gameInstance.board.grid);

        if (move.row === this.promotionRow) {
          move = { ...move, case: "promotion" };
        }
        
        if (targetPiece && targetPiece.player !== this.player) {
          arr.push(move);
        }
      }
    }
  }

  enPassantMovement = (arr) => {
    if (this.position.row === this.enPassantRow) {
      const opponent = gameInstance.getOpponent();
      const opponentLastMove = opponent.moves[opponent.moves.length - 1];

      if (
        opponentLastMove.piece === "pawn" &&
        opponentLastMove.toPosition.row === this.position.row &&
        Math.abs(opponentLastMove.toPosition.col - this.position.col) === 1 &&
        Math.abs(opponentLastMove.toPosition.row - opponentLastMove.fromPosition.row) === 2
      ) {
        const move = { row: opponentLastMove.toPosition.row + this.direction, col: opponentLastMove.toPosition.col, case: "en-passant", direction: this.direction }
        arr.push(move);
      }
    }
  }
}