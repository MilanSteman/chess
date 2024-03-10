"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPlayerInRoom = void 0;
function findPlayerInRoom(rooms, playerID) {
  for (const room of rooms.values()) {
    if (room.players[playerID]) {
      return room;
    }
  }
  return null;
}
exports.findPlayerInRoom = findPlayerInRoom;
//# sourceMappingURL=findPlayerInRoom.js.map
