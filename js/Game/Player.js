import { formatTime } from "../misc/timeHelper.js";

export default class Player {
  constructor(color, time) {
    this.color = color;
    this.pieces = [];
    this.moves = [];
    this.time = time;
    this.timeInterval = null;
    this.timerElement = document.querySelector(`#timer-${this.color}`);
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