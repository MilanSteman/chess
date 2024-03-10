"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMoveToDB = void 0;
const RoomModel_js_1 = require("../models/RoomModel.js");
async function updateMoveToDB(roomName, madeMove) {
    try {
        const updatedRoom = await RoomModel_js_1.RoomModel.findOneAndUpdate({ roomName }, {
            $push: { moves: madeMove },
        }, { new: true });
        if (!updatedRoom) {
            console.error("Room not found for update:", roomName);
            return;
        }
    }
    catch (error) {
        console.error("Error fetching room from the database:", error);
    }
}
exports.updateMoveToDB = updateMoveToDB;
//# sourceMappingURL=updateMoveToDB.js.map