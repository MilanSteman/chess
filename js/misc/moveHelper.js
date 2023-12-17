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

const getKing = () => {
  const allyPieces = gameInstance.currentPlayer.pieces;
  return allyPieces.find((piece) => piece.name === "king");
}

export const isInCheck = () => {
  const king = getKing();
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
  if (piece.color === gameInstance.currentPlayer) {
    const copiedGrid = deepCopyArray(gameInstance.board.grid);
    const originalPiece = { ...piece };
  
    piece._position = nextPosition;
  
    gameInstance.board.setPieceFromGrid(piece);
    gameInstance.board.removePieceFromGrid(originalPiece);
    
    const isCheck = isInCheck();
  
    piece._position = originalPiece._position;
  
    gameInstance.board.grid = copiedGrid;
  
    return isCheck;
  
  }
}

const deepCopyArray = (arr) => {
  return arr.map(innerArray => [...innerArray]);
}