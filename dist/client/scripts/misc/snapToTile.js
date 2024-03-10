import { Board } from "../Chess/game/Board.js";
import { Piece } from "../Chess/pieces/Piece.js";
function snapToTile(instance, row, col) {
    instance.pieceDomEl.style.top = `${row * (100 / Board.COL_SIZE)}%`;
    instance.pieceDomEl.style.left = `${col * (100 / Board.ROW_SIZE)}%`;
    instance.pieceDomEl.style.zIndex = Piece.Z_INDEX.DEFAULT;
}
export { snapToTile };
