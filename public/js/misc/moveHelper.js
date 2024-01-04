import { nameMap } from "./pieceMap.js";

/**
 * Moves a piece in a specified direction on the chessboard.
 * @param {{ row: number, col: number }} position - The current position of the piece.
 * @param {Player} player - The player making the move.
 * @param {Array<[number, number]>} directionArr - An array of direction vectors to move the piece.
 * @param {boolean} isRepeating - Indicates if the move is repeating (like for bishops and rooks).
 * @returns {Array<{ row: number, col: number }>} An array of possible moves in the specified direction.
 */
const moveInDirection = (piece, isRepeating) => {
  const possibleMoves = [];

  // Loop through each possible direction
  for (const [x, y] of piece.directions) {
    const newPosition = { row: piece.position.row, col: piece.position.col };

    // Update the position based on the provided direction until the move is out of bounds or repeating is false.
    do {
      newPosition.row += x;
      newPosition.col += y;

      if (piece.game.board.isPositionInBounds(newPosition)) {
        const occupiedTile = piece.game.board.getPieceFromGrid(newPosition);

        // Check if a tile is occupied by another piece.
        if (occupiedTile) {
          // If a tile is occupied by an opponent piece, add it to the list of moves.
          if (occupiedTile.player !== piece.player) {
            possibleMoves.push({ ...newPosition });
          }

          // Break, because you can't move through a piece.
          break;
        } else {
          // Add the move to the list of moves if a square is empty.
          possibleMoves.push({ ...newPosition });
        }
      }
    } while (isRepeating && piece.game.board.isPositionInBounds(newPosition));
  }

  return possibleMoves;
};

/**
 * Returns an array of possible repeating moves for a piece (e.g., bishop, rook, queen).
 * @param {{ row: number, col: number }} position - The current position of the piece.
 * @param {Player} player - The player making the move.
 * @param {Array<[number, number]>} directionArr - An array of direction vectors to move the piece.
 * @returns {Array<{ row: number, col: number }>} An array of possible repeating moves.
 */
export const repeatingMove = (piece) => {
  return moveInDirection(piece, true);
};

/**
 * Returns an array of possible single moves for a piece (e.g., knight, king).
 * @param {{ row: number, col: number }} position - The current position of the piece.
 * @param {Player} player - The player making the move.
 * @param {Array<[number, number]>} directionArr - An array of direction vectors to move the piece.
 * @returns {Array<{ row: number, col: number }>} An array of possible single moves.
 */
export const singleMove = (piece) => {
  return moveInDirection(piece, false);
};

/**
 * Retrieves the king piece of a specified player.
 * @param {Player} player - The player whose king is to be retrieved.
 * @returns {Piece|null} The king piece of the specified player, or null if not found.
 */
export const getKing = (player) => {
  const allyPieces = player.pieces;
  return allyPieces.find((piece) => piece.name === "king");
};

/**
 * Checks if the current player's king is in check.
 * @returns {boolean} True if the current player's king is in check, false otherwise.
 */
export const isInCheck = (game) => {
  const king = getKing(game.currentPlayer);
  const opponent = game.getOpponent();
  const opponentPieces = game.board.getAllPiecesFromGrid(opponent.color);

  if (king) {
    // Loop through all opponent pieces.
    for (const opponentPiece of opponentPieces) {
      // Get the possible moves of a piece.
      const possibleOpponentMoves = opponentPiece.setPossibleMoves();

      if (possibleOpponentMoves) {
        // Loop through all moves of the piece
        for (const possibleOpponentMove of possibleOpponentMoves) {
          const { row, col } = possibleOpponentMove;

          // If the possible move has the same coordinates as your king, return true (results in a check).
          if (row === king.position.row && col === king.position.col) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

/**
 * Checks if the current player's king is in check after a potential move.
 * @param {Piece} piece - The piece being moved.
 * @param {{ row: number, col: number }} nextPosition - The potential next position of the piece.
 * @returns {boolean} True if the current player's king is in check after the move, false otherwise.
 */
export const isInCheckAfterMove = (piece, nextPosition) => {
  // Create a deep copy of the current board. This is done so that your copied array isn't modified after initialization.
  // For more information, see: https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy
  const copiedGrid = piece.game.board.grid.map((inner) => [...inner]);
  const originalPiece = { ...piece };

  // Set target piece position to the desired next position.
  piece._position = nextPosition;

  // Update the board to simulate the move.
  piece.game.board.setPieceFromGrid(piece, piece.game.board.grid);
  piece.game.board.removePieceFromGrid(originalPiece);

  // Check is your king is in check after the move.
  const isCheck = isInCheck(piece.game);

  // Return piece to original position.
  piece._position = originalPiece._position;

  // Restore the grid back to the original position.
  piece.game.board.grid = copiedGrid;

  // Return if the simulate move resulted in a check.
  return isCheck;
};

/**
 * Sets the score element in the move list.
 * @param {Object} data - The move data including player, piece, positions, etc.
 */
export const setScoreElement = (data, game) => {
  // Alter the data so that it can be converted to a more desired result.
  const scoreData = manipulateData(data);

  if (scoreData && game.moveListElement) {
    // If the player is white, it should create a new row (turn).
    if (data.player.color === "white") {
      const turnElement = document.createElement("div");
      turnElement.classList.add("turn");
      game.moveListElement.append(turnElement);

      // Automatically scroll so that the latest move is always visible, even on overflow.
      game.moveListElement.scrollTop = game.moveListElement.scrollHeight;
    }

    // Create the move element (e.g., 'exd5')
    const moveElement = document.createElement("span");
    moveElement.textContent = scoreData;

    // Get the latest turn element and append the move to it.
    const currentTurnElement = game.moveListElement.lastChild;
    currentTurnElement.appendChild(moveElement);
  }
};

/**
 * Converts the move data into a formatted string for the move list.
 * @param {Object} data - The move data including player, piece, positions, etc.
 * @returns {string} The formatted string for the move list.
 */
const manipulateData = (data) => {
  // Update the data so that the position and prevPosition are modifed to show the true names of the row and column.
  const updatedData = {
    ...data,
    position: {
      row: data.toPosition.row + 1,
      col: setVisibleLetter(data.toPosition.col),
    },
    prevPosition: {
      row: data.fromPosition.row + 1,
      col: setVisibleLetter(data.fromPosition.col),
    },
  };

  // Set the annotation map with a new column for the pawn that holds no character.
  const annotationMap = new Map([...nameMap, ["pawn", { char: "" }]]);

  // Check if move is castle by checking the piece of the move.
  const isCastle = updatedData.piece === "O-O" || updatedData.piece === "O-O-O";

  // If it is castle, set the annotation to it's name (e.g., 'O-O'). Otherwise set it to it's character (e.g., 'q' for queen).
  const pieceAnnotation = isCastle
    ? updatedData.piece
    : annotationMap.get(updatedData.piece).char;

  // Set the capture text by checking if the piece is a pawn. If it is, it should set the previous column in front of the 'x'.
  const captureText =
    updatedData.piece === "pawn" ? `${updatedData.prevPosition.col}x` : "x";

  // If move is castle, it can't have a capture string.
  const captureString = updatedData.capture && !isCastle ? captureText : "";

  // Set the string of the check by checking if it is checkmate, check or nothing.
  const checkString = updatedData.checkmate
    ? "#"
    : updatedData.check
      ? "+"
      : "";

  // If the move is castle, it can't have a position.
  const positionString = isCastle
    ? ""
    : `${updatedData.position.col}${updatedData.position.row}`;

  // Return a stringbuilder of all possible outcomes.
  return `${pieceAnnotation}${captureString}${positionString}${checkString}`;
};

/**
 * Converts a number to a visible letter (e.g., 0 to 'a', 1 to 'b').
 * @param {number} num - The number to convert to a visible letter.
 * @returns {string} The visible letter corresponding to the input number.
 */
const setVisibleLetter = (num) => String.fromCharCode(97 + num);
