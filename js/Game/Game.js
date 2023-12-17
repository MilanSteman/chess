import Piece from '../Pieces/Piece.js';
import Board from './Board.js';
import Player from './Player.js';

class Game {
  constructor() {
    this.domElement = document.querySelector("#chessboard");
    this.board = new Board();

    this.players = {
      white: new Player("white"),
      black: new Player("black"),
    }

    this.currentPlayer = this.players.white;
  }

  runGame = () => {
    this.board.setPiecesFromFen();
  }

  switchCurrentPlayer = () => {
    this.currentPlayer = this.currentPlayer === this.players.white ? this.players.black : this.players.white;
  }

  getOpponent = () => {
    return this.currentPlayer === this.players.white ? this.players.black : this.players.white;
  }
}

const gameInstance = new Game();

export default gameInstance;