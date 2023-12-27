import gameInstance from "../Game/Game.js";

/**
 * Clears all visual elements related to piece highlighting.
 */
export const clearAllVisuals = () => {
  // Select all elements with classes 'is-attacked' and 'is-capturable'
  const visuals = document.querySelectorAll(
    ".is-attacked, .is-capturable",
  );

  // Remove each visual element
  visuals.forEach((visual) => {
    visual.remove();
  });
}

/**
 * Highlights possible legal moves for a given chess piece.
 * @param {Piece} piece - The chess piece for which to highlight possible moves.
 */
export const highlightPossibleMoves = (piece) => {
  // Clear existing visual highlights
  clearAllVisuals();

  // Get ally pieces for the current player
  const allyPieces = piece.player.pieces;

  // Deselect other selected pieces
  allyPieces.forEach((allyPiece) => {
    if (piece !== allyPiece) {
      allyPiece.isSelected = false;
    }
  });

  // Deselect the current piece if it is already selected
  if (piece.isSelected === true) {
    piece.isSelected = false;
    return false;
  }

  // Get legal moves for the selected piece
  const pieceMoves = piece.setLegalMoves();

  // Loop through each legal move and set it's DOM Element
  pieceMoves.forEach((move) => {
    // Set the type of move based on if it's a capture or not.
    const attackedPiece = gameInstance.board.getPieceFromGrid(move);
    const visualType = attackedPiece === null ? "is-attacked" : "is-capturable";

    // Create the DOM Element
    const visualDomElement = document.createElement("div");
    visualDomElement.setAttribute("data-row", move.row);
    visualDomElement.setAttribute("data-col", move.col);
    visualDomElement.classList.add(visualType);
    visualDomElement.addEventListener("click", () => { piece.moveToTile(move) });

    // Drag and drop functionalities.
    visualDomElement.ondragover = (e) => {
      e.preventDefault();
    };

    visualDomElement.ondrop = (e) => {
      e.preventDefault();
      piece.moveToTile(move);
    };

    gameInstance.domElement.appendChild(visualDomElement);
  });

  // Set the current piece as the selected one.
  piece.isSelected = true;
}