"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOppositeColor = exports.setRandomColor = void 0;
const Colors_js_1 = require("../enums/Colors.js");
/**
 * Sets a random color between black or white
 * @returns A string with either 'black' or 'white'
 */
function setRandomColor() {
    return Math.random() < 0.5 ? Colors_js_1.Colors.BLACK : Colors_js_1.Colors.WHITE;
}
exports.setRandomColor = setRandomColor;
/**
 * Sets the opposite color between black or white
 * @returns A string with either 'black' or 'white'
 */
function setOppositeColor(room) {
    var _a;
    const existingColor = (_a = (Object.values(room.players)[0])) === null || _a === void 0 ? void 0 : _a.color;
    return existingColor === Colors_js_1.Colors.WHITE ? Colors_js_1.Colors.BLACK : Colors_js_1.Colors.WHITE;
}
exports.setOppositeColor = setOppositeColor;
//# sourceMappingURL=setColor.js.map