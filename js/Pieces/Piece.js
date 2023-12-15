export default class Piece {
  constructor(position, player, name) {
    this._position = position;
    this.player = player;
    this.name = name;

    this.initializeDomElement();
  }

  get position() {
    return this._position;
  }

  set position(newPosition) {
    this._position = newPosition;
    console.log('asdfdsfg')
  }

  initializeDomElement = () => {
    const pieceDomElement = document.createElement("img");
    pieceDomElement.src = `images/pieces/${this.player}-${this.name}.png`;
    document.body.appendChild(pieceDomElement)
  }
}