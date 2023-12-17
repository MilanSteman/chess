import Piece from '../Pieces/Piece.js';
import Board from './Board.js';
import Player from './Player.js';

class Game {
  constructor() {
    this.domElement = document.querySelector("#chessboard");
    this.board = new Board();
    this.timeControl = 1200;
    this.timeIncrement = 2;

    this.players = {
      white: new Player("white", this.timeControl),
      black: new Player("black", this.timeControl),
    }

    this.currentPlayer = this.players.white;
  }

  runGame = () => {
    this.board.setPiecesFromFen();
    
    for (const player in this.players) {
      const playerObj = this.players[player];
      playerObj.setTimer();
    }

  }

  switchCurrentPlayer = () => {
    this.currentPlayer.time += this.timeIncrement;
    this.currentPlayer.pauseTimer();
    this.currentPlayer = this.currentPlayer === this.players.white ? this.players.black : this.players.white;
    this.currentPlayer.startTimer();
  }

  getOpponent = () => {
    return this.currentPlayer === this.players.white ? this.players.black : this.players.white;
  }
}

const gameInstance = new Game();

export default gameInstance;