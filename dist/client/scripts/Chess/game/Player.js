import { formatTime } from "../misc/formatTime.js";
import { getPieceAbbr } from "../misc/getPieceAbbr.js";
import { GameEndTypes, GameStatus } from "../enums/GameState.js";
import { Players } from "../enums/Players.js";
import { Game } from "./Game.js";
import client from "../../client.js";
/**
 * Represents a player class
 */
class Player {
    constructor(color) {
        this.timeInterval = null;
        /**
         * Starts the player's timer.
         */
        this.startTimer = () => {
            // Removes 1 from the total time every second.
            this.timeInterval = setInterval(() => {
                this.time -= 1;
            }, 1000);
        };
        /**
         * Updates the player's timer display.
         */
        this.setTimer = () => {
            const timerElement = document.querySelector(`.${this.color}-sidebar .timer`);
            if (timerElement) {
                timerElement.textContent = formatTime(this.time);
            }
        };
        /**
         * Pauses the player's timer.
         */
        this.pauseTimer = () => {
            if (this.timeInterval !== null) {
                clearInterval(this.timeInterval);
            }
        };
        this.color = color;
        this._madeMoves = [];
        this._captures = [];
        this.interfaceEl = document.createElement('div');
        this._time = this.color === Players.WHITE ? Game.timeControl.whiteTime : Game.timeControl.blackTime;
        this.timeInterval = null;
        this.createPlayerInterface();
    }
    /**
     * Gets the remaining time on the player's clock.
     */
    get time() {
        return this._time;
    }
    /**
     * Sets the remaining time on the player's clock.
     */
    set time(newTime) {
        this._time = newTime;
        // To avoid duplication calls to DB
        if (Game.player === this.color) {
            client.socket.emit("updateTime", newTime, this.color);
        }
        // If a player's time is up, set the opponent as the winner.
        if (this._time === 0) {
            Game.state = Object.assign(Object.assign({}, Game.state), { status: GameStatus.GAME_OVER, winner: Game.getOpponent(), endType: GameEndTypes.TIME });
        }
        // Update the visual timer.
        this.setTimer();
    }
    /**
     * Getter for the list of moves made by the player
     * @returns The list of moves made by the player
  
     */
    get madeMoves() {
        return this._madeMoves;
    }
    /**
     * Setter for the list of moves made by the player
     */
    set madeMoves(newMadeMoves) {
        this._madeMoves = newMadeMoves;
    }
    /**
     * Getter for the list of captured pieces by the player
     * @returns The list of captured pieces by the player
     */
    get captures() {
        return this._captures;
    }
    /**
     * Setter for the list of captured pieces by the player
     */
    set captures(newCaptures) {
        // Extract the last captured piece from the new captures
        const [newCapture] = newCaptures.slice(-1);
        const newCaptureEl = this.setCaptureInInterface(newCapture);
        const capturedPiecesEl = document.querySelector(`.${this.color}-sidebar .captured-pieces`);
        capturedPiecesEl === null || capturedPiecesEl === void 0 ? void 0 : capturedPiecesEl.appendChild(newCaptureEl);
        Game.advantage += newCapture.value * (this.color === Players.WHITE ? 1 : -1);
        this._captures = newCaptures;
    }
    createPlayerInterface() {
        this.interfaceEl.classList.add(`${this.color}-sidebar`);
        // Create capture row
        const captureRow = document.createElement('div');
        captureRow.classList.add('captured-pieces');
        const timerEl = document.createElement("div");
        timerEl.classList.add("timer");
        this.interfaceEl.appendChild(captureRow);
        this.interfaceEl.appendChild(timerEl);
    }
    setCaptureInInterface(capture) {
        const captureEl = document.createElement("img");
        const { color, name } = capture;
        captureEl.src = `/images/${Game.pieceTheme}/${color.charAt(0)}${getPieceAbbr(name)}.png`;
        captureEl.draggable = false;
        captureEl.classList.add(`captured-${name.toLowerCase()}`);
        return captureEl;
    }
}
export { Player };
