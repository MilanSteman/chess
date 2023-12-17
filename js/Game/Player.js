import { formatTime } from "../misc/timeHelper.js";

export default class Player {
  constructor(color, game) {
    this.color = color;
    this.game = game;
    this.pieces = [];
    this.captures = [];
    this.value = 0;
    this.moves = [];
    this.time = this.game.timeControl.initialTime;
    this.timeInterval = null;
    this.timerElement = document.querySelector(`#timer-${this.color}`);
    this.advantageDirection = this.color === "white" ? 1 : -1;
  }

  get captures() {
    return this._captures;
  }

  set captures(newCaptures) {
    this._captures = newCaptures;

    if (this.captures[this.captures.length - 1]) {
      this.value += this.captures[this.captures.length - 1].value;
    }
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    this.game.advantage += this._value * this.advantageDirection;
  }

  get time() {
    return this._time;
  }

  set time(newTime) {
    this._time = newTime;
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