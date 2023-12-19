import { formatTime } from "../misc/timeHelper.js";

export default class Player {
  constructor(color, game) {
    this.color = color;
    this.game = game;
    this.pieces = [];
    this.captures = [];
    this.moves = [];
    this.time = this.game.timeControl.initialTime;
    this.timeInterval = null;
    this.timerElement = document.querySelector(`#timer-${this.color}`);
    this.capturesElement = document.querySelector(`#captures-${this.color}`);
    this.advantageDirection = this.color === "white" ? 1 : -1;
  }

  get captures() {
    return this._captures;
  }

  set captures(newCaptures) {
    this._captures = newCaptures;
    const capture = this.captures[this.captures.length - 1];

    if (capture) {
      this.game.advantage += this.captures[this.captures.length - 1].value * this.advantageDirection;

      const captureElement = this.capturesElement.querySelector(`.${capture.name}`);
      const captureDomElement = document.createElement("img");
      captureDomElement.src = `images/pieces/${capture.color}-${capture.name}.png`;
      captureElement.appendChild(captureDomElement)
    }
  }

  get time() {
    return this._time;
  }

  set time(newTime) {
    this._time = newTime;

    if (this._time === 0) {
      this.game.state = { ...this.game.state, gameOver: true, time: true, winner: this.game.getOpponent() };
    }

    this.setTimer();
  }

  startTimer = () => {
    this.timeInterval = setInterval(() => {
      this.time -= 1;
    }, 1000);
  }

  setTimer = () => {
    if (this.timerElement) {
      this.timerElement.textContent = formatTime(this.time);
    }
  };

  pauseTimer = () => {
    clearInterval(this.timeInterval);
  }
}