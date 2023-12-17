import gameInstance from "../Game/Game.js";

export const clearAllVisuals = () => {
  const visuals = document.querySelectorAll(
    ".is-attacked, .is-capturable",
  );

  visuals.forEach((visual) => {
    visual.remove();
  });
}

export const highlightPossibleMoves = (piece) => {
  clearAllVisuals();
  
  const allyPieces = piece.player.pieces;

  allyPieces.forEach((allyPiece) => {
    if (piece !== allyPiece) {
      allyPiece.isSelected = false;
    }
  });

  if (piece.isSelected === true) {
    piece.isSelected = false;
    return false;
  }

  const pieceMoves = piece.setLegalMoves();

  pieceMoves.forEach((move) => {
    const attackedPiece = gameInstance.board.getPieceFromGrid(move);

    const visualType = attackedPiece === null ? "is-attacked" : "is-capturable";

    const visualDomElement = document.createElement("div");
    visualDomElement.setAttribute("data-row", move.row);
    visualDomElement.setAttribute("data-col", move.col);
    visualDomElement.classList.add(visualType);
    visualDomElement.addEventListener("click", () => { (piece.moveToTile(move)) });

    gameInstance.domElement.appendChild(visualDomElement);
  });

  piece.isSelected = true;
}