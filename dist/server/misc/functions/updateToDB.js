"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTimeToDB = exports.updateMoveToDB = void 0;
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
async function updateTimeToDB(roomName, playerID, color, time) {
    try {
        const dbRoom = await RoomModel_js_1.RoomModel.findOne({ roomName });
        const playerColor = dbRoom.players[playerID].color;
        let updatedID;
        if (playerColor !== color) {
            const opponentID = Object.keys(dbRoom.players).find(id => id !== playerID);
            updatedID = opponentID;
        }
        else {
            updatedID = playerID;
        }
        const updatedRoom = await RoomModel_js_1.RoomModel.findOneAndUpdate({ roomName }, {
            $set: {
                [`players.${updatedID}.timeLeft`]: time
            }
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
exports.updateTimeToDB = updateTimeToDB;
//# sourceMappingURL=updateToDB.js.map