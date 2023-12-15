import gameInstance from "../Game/Game.js";

const moveInDirection = (position, player, directionArr, isRepeating) => {
  const possibleMoves = [];
  
  for (const [x, y] of directionArr) {
    let newPosition = { row: position.row, col: position.col };

    do {
      newPosition.row += x;
      newPosition.col += y;

      if (gameInstance.board.isPositionInBounds(newPosition)) {
        const occupiedTile = gameInstance.board.getPieceFromGrid(newPosition);

        if (occupiedTile) {
          if (occupiedTile.player !== player) {
            possibleMoves.push(newPosition);
          }
          break;
        } else {
          possibleMoves.push(newPosition);
        }
      }
    } while (
      isRepeating &&
      gameInstance.board.isPositionInBounds(newPosition)
    );
  }

  return possibleMoves;
};

export const repeatingMove = (position, player, directionArr) => {
  return moveInDirection(position, player, directionArr, true);
}

export const singleMove = (position, player, directionArr) => {
  return moveInDirection(position, player, directionArr, false);
}