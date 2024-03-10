"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePlayerInRoom = void 0;
function removePlayerInRoom(room, playerID) {
  if (room.players[playerID]) {
    delete room.players[playerID];
  }
}
exports.removePlayerInRoom = removePlayerInRoom;
//# sourceMappingURL=removePlayerInRoom.js.map
