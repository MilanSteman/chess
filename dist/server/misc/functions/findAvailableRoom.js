"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAvailableRoom = void 0;
const RoomData_1 = require("../enums/RoomData");
const RoomModel_1 = require("../models/RoomModel");
const generateRoom_1 = require("./generateRoom");
const getPlayerAmount_js_1 = require("./getPlayerAmount.js");
const setColor_js_1 = require("./setColor.js");
/**
 * Finds the first available room out of all rooms
 * @returns A room if one can be joined, otherwise null
 */
async function findAvailableRoom(rooms, playerID) {
    for (const room of rooms.values()) {
        const playersInRoom = (0, getPlayerAmount_js_1.getPlayerAmount)(room);
        if (room.roomStatus !== RoomData_1.RoomStatus.WAITING ||
            playersInRoom >= RoomData_1.RoomData.MAX_PLAYERS) {
            return null;
        }
        // If there is a room available, add the queuing player to it
        room.players[playerID] = {
            color: (0, setColor_js_1.setOppositeColor)(room),
            timeLeft: generateRoom_1.DEFAULT_TIME,
        };
        const { roomName } = room;
        try {
            await RoomModel_1.RoomModel.findOneAndUpdate({ roomName }, room);
            const updatedRoom = await RoomModel_1.RoomModel.findOne({ roomName });
            return updatedRoom.toObject();
        }
        catch (error) {
            console.error("Error updating room:", error);
        }
        return room;
    }
    return null;
}
exports.findAvailableRoom = findAvailableRoom;
//# sourceMappingURL=findAvailableRoom.js.map