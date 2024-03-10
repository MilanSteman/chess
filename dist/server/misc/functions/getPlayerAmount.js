"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerAmount = void 0;
/**
 * Gets the player amount in a room
 * @returns A number that is less or equal than the max player amount
 */
function getPlayerAmount(room) {
    return Object.keys(room.players).length;
}
exports.getPlayerAmount = getPlayerAmount;
//# sourceMappingURL=getPlayerAmount.js.map