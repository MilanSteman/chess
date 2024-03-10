import { Players } from "../enums/Players.js";
import { Game } from "../game/Game.js";
const DEFAULT_TRANSLATE = 0;
/**
 * Takes a DOM element and translates it based on the percentage
 */
function translate(el, row, col) {
    if (el) {
        if (Game.player === Players.BLACK) {
            col = -col;
            row = -row;
        }
        el.style.transform = `translate(${col}%, ${row}%)`;
    }
}
export { DEFAULT_TRANSLATE, translate };
