import { isInCheck } from '../misc/moveHelper.js';
import { isInsufficientMaterial } from '../misc/stateHelper.js';
import Board from './Board.js';
import Player from './Player.js';

/**
 * Represents a chess game.
 * @class
 */
class Game {
  /**
   * Creates a new chess game.
   * @constructor
   */
  constructor() {
    /**
     * The DOM element representing the chessboard.
     * @type {HTMLElement}
     */
    this.domElement = document.querySelector("#chessboard");

    /**
     * The DOM element representing the move list.
     * @type {HTMLElement}
     */
    this.moveListElement = document.querySelector(".move-list");

    /**
     * The chessboard instance for the game.
     * @type {Board}
     */
    this.board = new Board();

    /**
     * The time control settings for the game.
     * @type {{
     *   initialTime: number,
     *   increment: number
     * }}
     */
    this.timeControl = {
      initialTime: 1200,
      increment: 2,
    };

    /**
     * The players participating in the game.
     * @type {{
     *   white: Player,
     *   black: Player
     * }}
     */
    this.players = {
      white: new Player("white", this),
      black: new Player("black", this),
    };

    /**
     * The current player making a move.
     * @type {Player}
     */
    this.currentPlayer = this.players.white;

    /**
     * The advantage score of the current game state.
     * @type {number}
     */
    this.advantage = 0;

    /**
     * The state of the game.
     * @type {{
     *   gameOver: boolean,
     *   checkmate: boolean,
     *   stalemate: boolean,
     *   insufficientMaterial: boolean,
     *   time: boolean,
     *   winner: Player|null
     * }}
     */
    this._state = {
      gameOver: false,
      checkmate: false,
      stalemate: false,
      insufficientMaterial: false,
      time: false,
      winner: null,
    };
  }

  /**
   * Gets the current state of the game.
   * @returns {{
   *   gameOver: boolean,
   *   checkmate: boolean,
   *   stalemate: boolean,
   *   insufficientMaterial: boolean,
   *   time: boolean,
   *   winner: Player|null
   * }}
   */
  get state() {
    return this._state;
  }

  /**
   * Sets the state of the game.
   * @param {{
   *   gameOver: boolean,
   *   checkmate: boolean,
   *   stalemate: boolean,
   *   insufficientMaterial: boolean,
   *   time: boolean,
   *   winner: Player|null
   * }} newValue - The new state value.
   */
  set state(newValue) {
    this._state = newValue;

    if (this.state.gameOver === true) {
      this.currentPlayer.pauseTimer();
      this.currentPlayer = null;
    }
  }

  /**
   * Gets the advantage score of the current game state.
   * @returns {number}
   */
  get advantage() {
    return this._advantage;
  }

  /**
   * Sets the advantage score of the current game state.
   * @param {number} newAdvantage - The new advantage score.
   */
  set advantage(newAdvantage) {
    this._advantage = newAdvantage;

    // Loop through each player to set the advantage on the score element.
    Object.values(this.players).forEach((player) => {
      const scoreElement = player.capturesElement.querySelector(".score");

      // Set the advantage if it isn't equal to 0.
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

  /**
   * Initializes and starts the chess game.
   */
  runGame = () => {
    // Initialize the board.
    this.board.setPiecesFromFen();

    // Set the timer element.
    Object.values(this.players).forEach((player) => {
      player.setTimer();
    });
  }

  /**
   * Switches the current player and handles game state accordingly.
   */
  switchCurrentPlayer = () => {
    // Handle the time control of the player making the move.
    this.currentPlayer.time += this.timeControl.increment;
    this.currentPlayer.pauseTimer();

    // Switch the active player.
    this.currentPlayer = this.currentPlayer === this.players.white ? this.players.black : this.players.white;

    // Start the opponent timer and check for a change in the state of the game (e.g., checkmate).
    this.currentPlayer.startTimer();
    this.handleGameState();
  }

  /**
   * Gets the opponent player of the given player.
   * @param {Player} player - The player for whom to find the opponent.
   * @returns {Player} The opponent player.
   */
  getOpponent = (player) => {
    if (player) {
      return player === this.players.white ? this.players.black : this.players.white;
    }

    return this.currentPlayer === this.players.white ? this.players.black : this.players.white;
  }

  /**
   * Handles the current game state, checking for checkmate, stalemate, and insufficient material.
   */
  handleGameState = () => {
    const currentPlayerPieces = this.currentPlayer.pieces;
    const opponentPlayerPieces = this.getOpponent().pieces;

    // Check for insufficient material
    if (isInsufficientMaterial(currentPlayerPieces, opponentPlayerPieces)) {
      this.state = { ...this.state, gameOver: true, insufficientMaterial: true };
      return false;
    }

    // Check if current player has any moves left
    if (currentPlayerPieces.some(piece => piece.setLegalMoves().length)) {
      return false;
    }

    // If current player has no moves left and is in check, return checkmate. Otherwise stalemate.
    if (isInCheck()) {
      this.state = { ...this.state, gameOver: true, checkmate: true, winner: this.getOpponent() };
    } else {
      this.state = { ...this.state, gameOver: true, stalemate: true };
    }
  }
}

/**
 * The instance of the chess game.
 * @type {Game}
 */
const gameInstance = new Game();

export default gameInstance;
