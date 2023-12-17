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

    const initializeDomElement = () => {
      const pieceDomElement = document.createElement("img");
      pieceDomElement.src = `images/pieces/${this.color}-${this.name}.png`;
      pieceDomElement.setAttribute("data-row", position.row);
      pieceDomElement.setAttribute("data-col", position.col);
      pieceDomElement.addEventListener("click", () => { setPieceClick() });
      gameInstance.domElement.appendChild(pieceDomElement);

      this.domElement = document.querySelector(
        `img[data-row="${this.position.row}"][data-col="${this.position.col}"]`,
      );

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

  setPossibleMoves = () => {}

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

    if (move.case && move.case === "en-passant") {
      targetPiece = gameInstance.board.getPieceFromGrid({ row: move.row - 1 * move.direction, col: move.col });
    }

    if (move.case && move.case === "castle") {
      const rookDirection = move.type === "long" ? -1 : 1;
      const rookPosition = move.type === "long" ? 0 : 7;
      const castledRook = gameInstance.board.getPieceFromGrid({ row: move.row, col: rookPosition });
      castledRook.makeMove({ row: move.row, col: move.col - rookDirection });
    }

    if (targetPiece) {
      targetPiece.domElement.remove();
      targetPiece.player.pieces = targetPiece.player.pieces.filter((piece) => piece !== targetPiece);
      this.player.captures = [...this.player.captures, targetPiece];
      // this.player.captures.push(targetPiece)
    }

    this.makeMove(move);

    if (move.case && move.case === "promotion") {
      setTimeout(() => {
        const queenChar = this.color === "white" ? "Q" : "q";
        this.domElement.remove();
        this.player.pieces = this.player.pieces.filter((piece) => piece !== this);
        gameInstance.board.initializePieceInGrid(queenChar, { row: move.row, col: move.col });
      }, 300);
    }

    gameInstance.switchCurrentPlayer();
  };

  makeMove = (move) => {
    const originalPiece = { ...this };

    this.position = move;

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
  }
}