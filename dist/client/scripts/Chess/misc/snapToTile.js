import { Players } from "../enums/Players.js";
import { Board } from "../game/Board.js";
import { Game } from "../game/Game.js";
import { Piece } from "../pieces/Piece.js";
function snapToTile(instance, row, col) {
    let leftPercentage = row * (100 / Board.COL_SIZE);
    let topPercentage = col * (100 / Board.ROW_SIZE);
    if (Game.player === Players.BLACK) {
        leftPercentage = 100 - leftPercentage - 100 / Board.COL_SIZE;
        topPercentage = 100 - topPercentage - 100 / Board.ROW_SIZE;
    }
    instance.pieceDomEl.style.top = `${leftPercentage}%`;
    instance.pieceDomEl.style.left = `${topPercentage}%`;
    instance.pieceDomEl.style.zIndex = Piece.Z_INDEX.DEFAULT;
}
export { snapToTile };
