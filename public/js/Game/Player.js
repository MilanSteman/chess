import { setScoreElement } from "../misc/moveHelper.js";
import { formatTime } from "../misc/timeHelper.js";

/**
 * Represents a player in the chess game.
 * @class
 */
export default class Player {
  /**
   * Creates a new player.
   * @constructor
   * @param {string} color - The color of the player ('white' or 'black').
   * @param {Game} game - The game instance the player is part of.
   */
  constructor(color, game) {
    /**
     * The color of the player ('white' or 'black').
     * @type {string}
     */
    this.color = color;

    /**
     * The game instance the player is part of.
     * @type {Game}
     */
    this.game = game;

    /**
     * An array of pieces controlled by the player.
     * @type {Array<Piece>}
     */
    this.pieces = [];

    /**
     * An array of captured pieces by the player.
     * @type {Array<Piece>}
     */
    this.captures = [];

    /**
     * An array of moves made by the player.
     * @type {Array<Move>}
     */
    this.moves = [];

    /**
     * The remaining time on the player's clock.
     * @type {number}
     */
    this.time = this.game.timeControl.initialTime;

    /**
     * The interval responsible for updating the player's clock.
     * @type {number|null}
     */
    this.timeInterval = null;

    /**
     * The DOM element representing the player's timer.
     * @type {HTMLElement}
     */
    this.timerElement = document.querySelector(`.timer-${this.color}`);

    /**
     * The DOM element representing the player's captured pieces.
     * @type {HTMLElement}
     */
    this.capturesElement = document.querySelector(`.captures-${this.color}`);

    /**
     * The direction of advantage for the player ('1' for white, '-1' for black).
     * @type {number}
     */
    this.advantageDirection = this.color === "white" ? 1 : -1;
  }

  /**
   * Gets the array of captured pieces by the player.
   * @returns {Array<Piece>}
   */
  get captures() {
    return this._captures;
  }

  /**
   * Sets the array of captured pieces by the player.
   * @param {Array<Piece>} newCaptures - The new array of captured pieces.
   */
  set captures(newCaptures) {
    this._captures = newCaptures;

    // Get the latest capture
    const capture = this.captures[this.captures.length - 1];

    if (capture) {
      // Update the game advantage based on the last capture
      this.game.advantage += capture.value * this.advantageDirection;

      // Set the DOM Element for visually displaying the piece.
      const captureElement = this.capturesElement.querySelector(
        `.${capture.name}`,
      );
      const captureDomElement = document.createElement("img");
      captureDomElement.src = `public/images/pieces/${capture.color}-${capture.name}.png`;

      captureElement.appendChild(captureDomElement);
    }
  }

  /**
   * Gets the array of moves made by the player.
   * @returns {Array<Move>}
   */
  get moves() {
    return this._moves;
  }

  /**
   * Sets the array of moves made by the player.
   * @param {Array<Move>} newMoves - The new array of moves.
   */
  set moves(newMoves) {
    this._moves = newMoves;

    // Get the latest move
    const move = this.moves[this.moves.length - 1];

    if (move) {
      // Set the move element as a DOM element in the column to the right of the board.
      setScoreElement(move);
    }
  }

  /**
   * Gets the remaining time on the player's clock.
   * @returns {number}
   */
  get time() {
    return this._time;
  }

  /**
   * Sets the remaining time on the player's clock.
   * @param {number} newTime - The new remaining time.
   */
  set time(newTime) {
    this._time = newTime;

    // If a player's time is up, set the opponent as the winner.
    if (this._time === 0) {
      this.game.state = {
        ...this.game.state,
        gameOver: true,
        time: true,
        winner: this.game.getOpponent(),
      };
    }

    // Update the visual timer.
    this.setTimer();
  }

  /**
   * Starts the player's timer.
   */
  startTimer = () => {
    // Removes 1 from the total time every second.
    this.timeInterval = setInterval(() => {
      this.time -= 1;
    }, 1000);
  };

  /**
   * Updates the player's timer display.
   */
  setTimer = () => {
    if (this.timerElement) {
      this.timerElement.textContent = formatTime(this.time);
    }
  };

  /**
   * Pauses the player's timer.
   */
  pauseTimer = () => {
    clearInterval(this.timeInterval);
  };
}
