"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReconnection = exports.handleConnection = void 0;
const generateRandomName_1 = require("./generateRandomName");
const RoomModel_1 = require("../models/RoomModel");
const Colors_1 = require("../enums/Colors");
function handleConnection(socket) {
    var _a;
    const playerID = (_a = socket.handshake.headers.cookie) === null || _a === void 0 ? void 0 : _a.split("=")[1];
    if (playerID) {
        return playerID;
    }
    const generatedPlayerID = (0, generateRandomName_1.generateRandomName)();
    socket.emit("setCookie", { name: "playerID", value: generatedPlayerID });
    socket.handshake.headers.cookie = `playerId=${generatedPlayerID}`;
    socket.handshake.headers["Access-Control-Allow-Headers"] = "playerID";
    return generatedPlayerID;
}
exports.handleConnection = handleConnection;
async function handleReconnection(socket, room, playerID) {
    if (!room) {
        return;
    }
    try {
        const { roomName } = room;
        const dbRoom = await RoomModel_1.RoomModel.findOne({ roomName });
        socket.join(roomName);
        const color = dbRoom.players[playerID].color;
        const moves = dbRoom.moves;
        const opponentID = Object.keys(room.players).find((id) => id !== playerID);
        const whiteTime = color === Colors_1.Colors.WHITE
            ? dbRoom.players[playerID].timeLeft
            : dbRoom.players[opponentID].timeLeft;
        const blackTime = color === Colors_1.Colors.BLACK
            ? dbRoom.players[playerID].timeLeft
            : dbRoom.players[opponentID].timeLeft;
        socket.emit("startMatch", { color, moves, whiteTime, blackTime });
    }
    catch (error) {
        console.error("Error fetching room from the database:", error);
    }
}
exports.handleReconnection = handleReconnection;
//# sourceMappingURL=handleConnection.js.map