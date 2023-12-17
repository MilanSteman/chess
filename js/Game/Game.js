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
      white: new Player("white", this),
      black: new Player("black", this),
    }

    this.currentPlayer = this.players.white;

    this.advantage = 0;

    this.state = {
      checkmate: false,
      stalemate: false,
      winner: null
    }
  }
  
  get state() {
    return this._state;
  }

  set state(newValue) {
    this._state = newValue;
    this.currentPlayer.pauseTimer();
  }

  get advantage() {
    return this._advantage;
  }

  set advantage(newAdvantage) {
    this._advantage = newAdvantage;
    console.log(this._advantage)
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
    const currentPlayerPieces = gameInstance.currentPlayer.pieces;

    if (currentPlayerPieces.some(piece => piece.setLegalMoves().length)) {
      return false;
    }

    //mayb insufficient material down the line idc

    if (isInCheck()) {
      this.state = { ...this.state, winner: this.getOpponent(), checkmate: true };
    } else {
      this.state = { ...this.state, stalemate: true };
    }
  }
}

const gameInstance = new Game();

export default gameInstance;