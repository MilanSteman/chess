"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TIME = exports.generateRoom = void 0;
const RoomData_js_1 = require("../enums/RoomData.js");
const RoomModel_js_1 = require("../models/RoomModel.js");
const generateRandomName_js_1 = require("./generateRandomName.js");
const setColor_js_1 = require("./setColor.js");
const DEFAULT_TIME = 1200;
exports.DEFAULT_TIME = DEFAULT_TIME;
/**
 * Generates a room
 * @returns A room following the room interface
 */
async function generateRoom(playerID) {
    const roomName = (0, generateRandomName_js_1.generateRandomName)();
    const roomStatus = RoomData_js_1.RoomStatus.WAITING;
    const generatedRoom = new RoomModel_js_1.RoomModel({
        roomName,
        roomStatus,
        players: {
            [playerID]: {
                color: (0, setColor_js_1.setRandomColor)(),
                timeLeft: DEFAULT_TIME,
            },
        },
        moves: [],
    });
    try {
        await generatedRoom.save();
        return generatedRoom.toObject();
    }
    catch (error) {
        console.error("Error creating room:", error);
        return null;
    }
}
exports.generateRoom = generateRoom;
//# sourceMappingURL=generateRoom.js.map