import gameInstance from "../Game/Game.js";

const moveInDirection = (position, player, directionArr, isRepeating) => {
  const possibleMoves = [];

  for (const [x, y] of directionArr) {
    const newPosition = { row: position.row, col: position.col };

    do {
      newPosition.row += x;
      newPosition.col += y;

      if (gameInstance.board.isPositionInBounds(newPosition)) {
        const occupiedTile = gameInstance.board.getPieceFromGrid(newPosition);

        if (occupiedTile) {
          if (occupiedTile.player !== player) {
            possibleMoves.push({ ...newPosition });
          }
          break;
        } else {
          possibleMoves.push({ ...newPosition });
        }
      }
    } while (isRepeating && gameInstance.board.isPositionInBounds(newPosition));
  }

  return possibleMoves;
};

export const repeatingMove = (position, player, directionArr) => {
  return moveInDirection(position, player, directionArr, true);
}

export const singleMove = (position, player, directionArr) => {
  return moveInDirection(position, player, directionArr, false);
}

export const getKing = (player) => {
  const allyPieces = player.pieces;
  return allyPieces.find((piece) => piece.name === "king");
}

export const isInCheck = () => {
  const king = getKing(gameInstance.currentPlayer);
  const opponent = gameInstance.getOpponent();
  const opponentPieces = gameInstance.board.getAllPiecesFromGrid(opponent.color);

  if (king) {
    for (const opponentPiece of opponentPieces) {
      const possibleOpponentMoves = opponentPiece.setPossibleMoves();

      if (possibleOpponentMoves) {
        for (const possibleOpponentMove of possibleOpponentMoves) {
          const { row, col } = possibleOpponentMove;

          if (row === king.position.row && col === king.position.col) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

export const isInCheckAfterMove = (piece, nextPosition) => {
  const copiedGrid = gameInstance.board.grid.map(inner => [...inner]);
  const originalPiece = { ...piece };
  piece._position = nextPosition;

  gameInstance.board.setPieceFromGrid(piece);
  gameInstance.board.removePieceFromGrid(originalPiece);

  const isCheck = isInCheck();

  piece._position = originalPiece._position;

  gameInstance.board.grid = copiedGrid;

  return isCheck;
}

const scoreMap = new Map([
  ["rook", { char: "r" }],
  ["knight", { char: "n" }],
  ["bishop", { char: "b" }],
  ["queen", { char: "q" }],
  ["king", { char: "k" }],
  ["pawn", { char: "" }],
]);

export const setScoreElement = (data) => {
  const scoreData = manipulateData(data);

  if (scoreData) {
    if (data.player.color === "white") {
      const turnElement = document.createElement("div");
      turnElement.classList.add("turn");
      gameInstance.moveListElement.append(turnElement);
    }

    const moveElement = document.createElement("span");
    moveElement.textContent = scoreData;

    const currentTurnElement = gameInstance.moveListElement.lastChild;
    currentTurnElement.appendChild(moveElement);
  }
}

const setVisibleLetter = (num) => String.fromCharCode(97 + num);

const manipulateData = (data) => {
  const reformedData = {
    ...data,
    position: { row: data.toPosition.row + 1, col: setVisibleLetter(data.toPosition.col) },
    prevPosition: { row: data.fromPosition.row + 1, col: setVisibleLetter(data.fromPosition.col) },
  };

  const isCastle = reformedData.piece === "O-O" || reformedData.piece === "O-O-O";

  const pieceAnnotation = isCastle
    ? reformedData.piece
    : scoreMap.get(reformedData.piece).char;

  const captureText = reformedData.piece === "pawn" ? `${reformedData.prevPosition.col}x` : "x";
  const captureString = reformedData.capture && !isCastle ? captureText : "";

  const checkString = reformedData.checkmate ? "#" : (reformedData.check ? "+" : "");

  const positionString = isCastle ? "" : `${reformedData.position.col}${reformedData.position.row}`;

  return `${pieceAnnotation}${captureString}${positionString}${checkString}`;
};


