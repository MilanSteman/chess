import gameInstance from '../Game/Game.js';

export default class Piece {
  constructor(position, player, name) {
    this._position = position;
    this.player = player;
    this.color = this.player.color;
    this.name = name;

    const initializeDomElement = () => {
      const pieceDomElement = document.createElement("img");
      pieceDomElement.src = `images/pieces/${this.color}-${this.name}.png`;
      pieceDomElement.setAttribute("data-row", position.row);
      pieceDomElement.setAttribute("data-col", position.col);
      pieceDomElement.addEventListener("click", () => { setPieceClick() });

      gameInstance.domElement.appendChild(pieceDomElement)
    }

    const setPieceClick = () => {
      if (gameInstance.currentPlayer === this.player) {
        console.log('its white')
      }
    }

    initializeDomElement();
  }

  get position() {
    return this._position;
  }

  set position(newPosition) {
    this._position = newPosition;
    console.log('asdfdsfg')
  }

  setPossibleMoves = () => { }
}