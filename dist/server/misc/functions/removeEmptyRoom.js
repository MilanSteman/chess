"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEmptyRoom = void 0;
function removeEmptyRoom(rooms, room) {
    if (Object.keys(room.players).length === 0) {
        rooms.delete(room.roomName);
    }
}
exports.removeEmptyRoom = removeEmptyRoom;
//# sourceMappingURL=removeEmptyRoom.js.map