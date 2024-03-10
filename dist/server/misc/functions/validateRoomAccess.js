"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectIfInRoom = exports.validateRoomAccess = void 0;
const server_js_1 = require("../../server.js");
const findAndDeletePlayerInRoom_1 = require("./findAndDeletePlayerInRoom");
function validateRoomAccess(req, res, next) {
    const foundRoom = (0, findAndDeletePlayerInRoom_1.findRoomFromPlayer)(server_js_1.app.rooms, req.playerID);
    if (!foundRoom || foundRoom.roomName !== req.params.roomName) {
        return res.redirect("/");
    }
    next();
}
exports.validateRoomAccess = validateRoomAccess;
function redirectIfInRoom(req, res, next) {
    const foundRoom = (0, findAndDeletePlayerInRoom_1.findRoomFromPlayer)(server_js_1.app.rooms, req.playerID);
    if (foundRoom) {
        return res.redirect(`/room/${foundRoom.roomName}`);
    }
    next();
}
exports.redirectIfInRoom = redirectIfInRoom;
//# sourceMappingURL=validateRoomAccess.js.map