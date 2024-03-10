import { Players } from "../enums/Players.js";
import { Game } from "../game/Game.js";
function getMergedMoveArray() {
    const mergedArray = [];
    // Assuming all player.madeMoves arrays have the same length
    const maxMovesLength = Math.max(...Object.values(Game.players).map((player) => player.madeMoves.length));
    for (let i = 0; i < maxMovesLength; i++) {
        Object.values(Game.players).forEach((player) => {
            // Check if the player has a move at the current index
            if (i < player.madeMoves.length) {
                // Add white moves at even indices, black moves at odd indices
                const index = i * 2 + (player.color === Players.WHITE ? 1 : 0);
                mergedArray[index] = player.madeMoves[i];
            }
        });
    }
    return mergedArray;
}
export { getMergedMoveArray };
