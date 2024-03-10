"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomData = exports.RoomStatus = void 0;
/**
 * Enum for the room status
 */
var RoomStatus;
(function (RoomStatus) {
    RoomStatus["WAITING"] = "waiting";
    RoomStatus["PLAYING"] = "playing";
    RoomStatus["ENDED"] = "ended";
})(RoomStatus || (exports.RoomStatus = RoomStatus = {}));
/**
 * Enum for the room data
 */
var RoomData;
(function (RoomData) {
    RoomData[RoomData["MAX_PLAYERS"] = 2] = "MAX_PLAYERS";
})(RoomData || (exports.RoomData = RoomData = {}));
//# sourceMappingURL=RoomData.js.map