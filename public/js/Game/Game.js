import { isInCheck } from "../misc/moveHelper.js";
import { isInsufficientMaterial } from "../misc/stateHelper.js";
import { capitalizeFirstLetter } from "../misc/visualHelper.js";
import Board from "./Board.js";
import Player from "./Player.js";

/**
 * Represents a chess game.
 * @class
 */
export default class Game {
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
     * The size of the chessboard.
     * @type {number}
     */
    this.boardSize = 8;

    /**
     * The chessboard instance for the game.
     * @type {Board}
     */
    this.board = new Board(this);

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
     * The FEN (Forsyth-Edwards Notation) string representing the initial board position.
     * @type {string}
     */
    this.fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

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
     *   winner: Player|null,
     *   winType: {
     *     checkmate: boolean,
     *     stalemate: boolean,
     *     insufficientMaterial: boolean,
     *     time: boolean,
     *   }
     * }}
     */
    this._state = {
      gameOver: false,
      winner: null,
      winType: {
        checkmate: false,
        stalemate: false,
        insufficientMaterial: false,
        time: false,
      },
    };
  }

  /**
   * Gets the current state of the game.
   * @returns {{
   *   gameOver: boolean,
   *   winner: Player|null,
   *   winType: {
   *     checkmate: boolean,
   *     stalemate: boolean,
   *     insufficientMaterial: boolean,
   *     time: boolean,
   *   }
   * }}
   */
  get state() {
    return this._state;
  }

  /**
   * Sets the state of the game.
   * @param {{
   *   gameOver: boolean,
   *   winner: Player|null,
   *   winType: {
   *     checkmate: boolean,
   *     stalemate: boolean,
   *     insufficientMaterial: boolean,
   *     time: boolean,
   *   }
   * }} newValue - The new state value.
   */
  set state(newValue) {
    this._state = newValue;

    if (this.state.gameOver === true && this.domElement) {
      // Create game over modal.
      const checkmateModal = document.createElement("div");
      checkmateModal.classList.add("popup-modal");

      // Set text to 'Tie' if there is no winner (winner = null).
      const winnerText = this.state.winner
        ? `${capitalizeFirstLetter(this.state.winner.color)} Won`
        : "Tie";

      checkmateModal.textContent = winnerText;

      // Set text that declares the win type.
      const winTypeText = document.createElement("span");
      let winType = Object.keys(this.state.winType).find(
        (type) => this.state.winType[type],
      );

      // Update insufficient material text to not be camelCase on render.
      winType =
        winType === "insufficientMaterial" ? "Insufficient Material" : winType;

      winTypeText.textContent = `By ${winType}`;
      checkmateModal.appendChild(winTypeText);

      // Create button that restarts game.
      const buttonModal = document.createElement("button");
      buttonModal.textContent = "New Game";
      buttonModal.addEventListener("click", () => window.location.reload());
      checkmateModal.appendChild(buttonModal);

      this.domElement.appendChild(checkmateModal);

      // Set properties to null to avoid continuation of the game.
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
    for (const color in this.players) {
      const player = this.players[color];

      if (player.capturesElement) {
        const scoreElement = player.capturesElement.querySelector(".score");

        if (scoreElement) {
          // Set the advantage if it isn't equal to 0.
          if (
            (this._advantage < 0 && player.color === "black") ||
            (this._advantage > 0 && player.color === "white")
          ) {
            scoreElement.textContent = `+${Math.abs(this._advantage)}`;
          } else {
            scoreElement.textContent = null;
          }
        }
      }
    }
  }

  /**
   * Initializes and starts the chess game.
   */
  runGame = () => {
    // Initialize the board.
    this.board.setPiecesFromFen(this.fenString);

    // Set the timer element.
    for (const color in this.players) {
      const player = this.players[color];
      player.setTimer();
    }
  };

  /**
   * Switches the current player and handles game state accordingly.
   */
  switchCurrentPlayer = () => {
    // Handle the time control of the player making the move.
    this.currentPlayer.time += this.timeControl.increment;
    this.currentPlayer.pauseTimer();

    // Switch the active player.
    this.currentPlayer =
      this.currentPlayer === this.players.white
        ? this.players.black
        : this.players.white;

    // Start the opponent timer and check for a change in the state of the game (e.g., checkmate).
    this.currentPlayer.startTimer();
    this.handleGameState();
  };

  /**
   * Gets the opponent player of the given player.
   * @param {Player} player - The player for whom to find the opponent.
   * @returns {Player} The opponent player.
   */
  getOpponent = (player) => {
    if (player) {
      return player === this.players.white
        ? this.players.black
        : this.players.white;
    }

    return this.currentPlayer === this.players.white
      ? this.players.black
      : this.players.white;
  };

  /**
   * Handles the current game state, checking for checkmate, stalemate, and insufficient material.
   */
  handleGameState = () => {
    const currentPlayerPieces = this.currentPlayer.pieces;
    const opponentPlayerPieces = this.getOpponent().pieces;

    // Check for insufficient material
    if (isInsufficientMaterial(currentPlayerPieces, opponentPlayerPieces)) {
      this.state = {
        ...this.state,
        gameOver: true,
        winType: {
          ...this.state.winType,
          insufficientMaterial: true,
        },
      };
      return false;
    }

    // Check if current player has any moves left.
    if (currentPlayerPieces.some((piece) => piece.setLegalMoves().length)) {
      return false;
    }

    // If current player has no moves left and is in check, return checkmate. Otherwise stalemate (player has no moves, but not in check).
    if (isInCheck(this)) {
      this.state = {
        ...this.state,
        gameOver: true,
        winType: {
          ...this.state.winType,
          checkmate: true,
        },
        winner: this.getOpponent(),
      };
    } else {
      this.state = {
        ...this.state,
        gameOver: true,
        winType: {
          ...this.state.winType,
          stalemate: true,
        },
      };
    }
  };
}
