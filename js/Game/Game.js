import { isInCheck } from '../misc/moveHelper.js';
import { isInsufficientMaterial } from '../misc/stateHelper.js';
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
      white: new Player("white", this),
      black: new Player("black", this),
    }

    this.currentPlayer = this.players.white;

    this.advantage = 0;

    this.state = {
      gameOver: false,
      checkmate: false,
      stalemate: false,
      insufficientMaterial: false,
      time: false,
      winner: null
    }
  }

  get state() {
    return this._state;
  }

  set state(newValue) {
    this._state = newValue;
    console.log(this._state)

    if (this.state.gameOver === true) {
      this.currentPlayer.pauseTimer();
      this.currentPlayer = null;
    }
  }

  get advantage() {
    return this._advantage;
  }

  set advantage(newAdvantage) {
    this._advantage = newAdvantage;

    Object.values(this.players).forEach((player) => {
      const scoreElement = player.capturesElement.querySelector(".score");

      if (
        (this._advantage < 0 && player.color === "black") ||
        (this._advantage > 0 && player.color === "white")
      ) {
        scoreElement.textContent = `+${Math.abs(this._advantage)}`;
      } else {
        scoreElement.textContent = null;
      }
    });
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

    this.currentPlayer.startTimer();
    this.handleGameState();
  }

  getOpponent = () => {
    return this.currentPlayer === this.players.white ? this.players.black : this.players.white;
  }

  handleGameState = () => {
    const currentPlayerPieces = this.currentPlayer.pieces;
    const opponentPlayerPieces = this.getOpponent().pieces;

    if (isInsufficientMaterial(currentPlayerPieces, opponentPlayerPieces)) {
      this.state = { ...this.state, gameOver: true, insufficientMaterial: true };
      return false;
    }

    // somewhere we need to return when insufficient material is here. So e.g.: King and opponent King
    if (currentPlayerPieces.some(piece => piece.setLegalMoves().length)) {
      return false;
    }

    if (isInCheck()) {
      this.state = { ...this.state, gameOver: true, checkmate: true, winner: this.getOpponent() };
    } else {
      this.state = { ...this.state, gameOver: true, stalemate: true };
    }
  }
}

const gameInstance = new Game();

export default gameInstance;