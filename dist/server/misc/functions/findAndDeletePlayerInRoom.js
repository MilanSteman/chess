"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAndDeletePlayerInRoom = exports.findRoomFromPlayer = void 0;
const RoomModel_js_1 = require("../models/RoomModel.js");
function findRoomFromPlayer(rooms, playerID) {
    return (Array.from(rooms.values()).find((room) => room.players[playerID]) || null);
}
exports.findRoomFromPlayer = findRoomFromPlayer;
async function findAndDeletePlayerInRoom(rooms, playerID) {
    const room = findRoomFromPlayer(rooms, playerID);
    if (room) {
        delete room.players[playerID];
        if (Object.keys(room.players).length === 0) {
            rooms.delete(room.roomName);
            console.log(`Room deleted: ${room.roomName}`);
            const { roomName } = room;
            try {
                await RoomModel_js_1.RoomModel.deleteOne({ roomName }, room);
                console.log(`Deleted room ${roomName} from the database.`);
            }
            catch (error) {
                console.error("Error updating room:", error);
            }
        }
    }
}
exports.findAndDeletePlayerInRoom = findAndDeletePlayerInRoom;
//# sourceMappingURL=findAndDeletePlayerInRoom.js.map