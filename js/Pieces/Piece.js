import gameInstance from '../Game/Game.js';
import { highlightPossibleMoves, clearAllVisuals } from '../misc/visualHelper.js';
import { isInCheckAfterMove } from '../misc/moveHelper.js';

export default class Piece {
  constructor(position, player, name) {
    this._position = position;
    this.player = player;
    this.color = this.player.color;
    this.name = name;
    this.isSelected = false;
    this.hasMoved = false;

    document.addEventListener("DOMContentLoaded", () => {
      this.domElement = document.querySelector(
        `img[data-row="${this.position.row}"][data-col="${this.position.col}"]`,
      );
    });

    const initializeDomElement = () => {
      const pieceDomElement = document.createElement("img");
      pieceDomElement.src = `images/pieces/${this.color}-${this.name}.png`;
      pieceDomElement.setAttribute("data-row", position.row);
      pieceDomElement.setAttribute("data-col", position.col);
      pieceDomElement.addEventListener("click", () => { setPieceClick() });
      gameInstance.domElement.appendChild(pieceDomElement)
    }

    const setPieceClick = () => {
      if (gameInstance.currentPlayer === this.player) {
        highlightPossibleMoves(this);
      }
    }

    initializeDomElement();
  }

  get position() {
    return this._position;
  }

  set position(newPosition) {
    this._position = newPosition;
    this.domElement.setAttribute("data-row", this._position.row);
    this.domElement.setAttribute("data-col", this._position.col);
  }

  setPossibleMoves = () => { }

  setLegalMoves = () => {
    const moves = this.setPossibleMoves();
    const legalMoves = [];

    for (const move of moves) {
      if (!isInCheckAfterMove(this, move)) {
        legalMoves.push(move)
      }
    }

    return legalMoves;
  }

  moveToTile = (move) => {
    let targetPiece = gameInstance.board.getPieceFromGrid(move);

    const originalPiece = { ...this };

    this.position = move;

    if (move.case && move.case === "en-passant") {
      const enPassantPosition = { row: move.row - 1 * move.direction, col: move.col };
      targetPiece = gameInstance.board.getPieceFromGrid(enPassantPosition);
    }
    
    if (targetPiece) {
      targetPiece.domElement.remove();
    }

    gameInstance.board.setPieceFromGrid(this);
    gameInstance.board.removePieceFromGrid(originalPiece);

    this.isSelected = false;
    this.hasMoved = true;

    const moveData = {
      piece: this.name,
      toPosition: this.position,
      fromPosition: originalPiece._position,
    }

    this.player.moves.push(moveData);

    clearAllVisuals();

    gameInstance.switchCurrentPlayer();
  };
}