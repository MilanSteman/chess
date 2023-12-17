import Piece from '../Pieces/Piece.js';
import { isInCheck } from '../misc/moveHelper.js';
import Board from './Board.js';
import Player from './Player.js';

class Game {
  constructor() {
    this.domElement = document.querySelector("#chessboard");
    this.board = new Board();

    this.timeControl = {
      initialTime: 1200,
      increment: 2,
    }

    this.players = {
      white: new Player("white", this.timeControl.initialTime),
      black: new Player("black", this.timeControl.initialTime),
    }

    this.currentPlayer = this.players.white;

    this.state = {
      checkmate: false,
      stalemate: false,
      winner: null
    }
  }

  runGame = () => {
    this.board.setPiecesFromFen();

    Object.values(this.players).forEach((player) => {
      player.setTimer();
    });
  }

  switchCurrentPlayer = () => {
    this.currentPlayer.time += this.timeControl.increment;
    this.currentPlayer.pauseTimer();
    this.currentPlayer = this.currentPlayer === this.players.white ? this.players.black : this.players.white;
    this.handleGameState();
    this.currentPlayer.startTimer();
  }

  getOpponent = () => {
    return this.currentPlayer === this.players.white ? this.players.black : this.players.white;
  }

  handleGameState = () => {
    const currentPlayerPieces = this.board.getAllPiecesFromGrid(this.currentPlayer.color);
    const test = isInCheck();

    if (currentPlayerPieces.some(piece => piece.setLegalMoves().length)) {
      return false;
    }

    if (isInCheck()) {
      this.state = { ...this.state, winner: this.getOpponent(), checkmate: true };
    } else {
      this.state = { ...this.state, winner: this.getOpponent(), stalemate: true };
    }

  }

  get state() {
    return this._state;
  }

  set state(newValue) {
    this._state = newValue;

    console.log(this.state);
  }
}

const gameInstance = new Game();

export default gameInstance;