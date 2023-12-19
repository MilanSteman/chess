import gameInstance from '../Game/Game.js';
import { highlightPossibleMoves, clearAllVisuals } from '../misc/visualHelper.js';
import { getKing, isInCheckAfterMove } from '../misc/moveHelper.js';

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
      pieceDomElement.draggable = true;
      pieceDomElement.ondragstart = () => { renderMovements(); }
      pieceDomElement.addEventListener("click", () => { renderMovements(); });
      gameInstance.domElement.appendChild(pieceDomElement);

      this.domElement = document.querySelector(
        `img[data-row="${this.position.row}"][data-col="${this.position.col}"]`,
      );
    }

    const renderMovements = () => {
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
    let isCheck = false;
    const originalPiece = { ...this };
    const isCapture = targetPiece !== null

    if (move.case && move.case === "en-passant") {
      targetPiece = gameInstance.board.getPieceFromGrid({ row: move.row - 1 * move.direction, col: move.col });
    }

    if (move.case && move.case === "castle") {
      const rookDirection = move.type === "O-O-O" ? -1 : 1;
      const rookPosition = move.type === "O-O-O" ? 0 : 7;
      const castledRook = gameInstance.board.getPieceFromGrid({ row: move.row, col: rookPosition });
      isCheck = castledRook.makeMove({ row: move.row, col: move.col - rookDirection });
      this.makeMove(move);
    } else {
      isCheck = this.makeMove(move);
    }

    if (targetPiece) {
      targetPiece.domElement.remove();
      targetPiece.player.pieces = targetPiece.player.pieces.filter((piece) => piece !== targetPiece);
      this.player.captures = [...this.player.captures, targetPiece];
    }

    if (move.case && move.case === "promotion") {
      setTimeout(() => {
        const queenChar = this.color === "white" ? "Q" : "q";
        this.domElement.remove();
        this.player.pieces = this.player.pieces.filter((piece) => piece !== this);
        gameInstance.board.initializePieceInGrid(queenChar, { row: move.row, col: move.col });
      }, 300);
    }

    const moveData = {
      piece: move.type ? move.type : this.name,
      toPosition: this.position,
      fromPosition: originalPiece._position,
      player: this.player,
      capture: isCapture,
      check: isCheck,
      checkmate: gameInstance.state.checkmate,
    }

    this.player.moves.push(moveData);

    console.log(this.player.moves[this.player.moves.length - 1])

    clearAllVisuals();

    gameInstance.switchCurrentPlayer();
  };

  makeMove = (move) => {
    const originalPiece = { ...this };
    let isCheck = false;

    this.position = move;

    gameInstance.board.setPieceFromGrid(this);
    gameInstance.board.removePieceFromGrid(originalPiece);

    this.isSelected = false;
    this.hasMoved = true;

    const legalMoves = this.setPossibleMoves();

    if (legalMoves) {
      const opponentKing = getKing(gameInstance.getOpponent());

      for (const move of legalMoves) {
        const { row, col } = move;

        if (row === opponentKing.position.row && col === opponentKing.position.col) {
          isCheck = true;
        }
      }
    }

    return isCheck;
  }
}