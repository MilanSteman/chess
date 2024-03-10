"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RoomSchema = new mongoose_1.default.Schema({
    roomName: {
        type: String,
        required: true,
        unique: true,
    },
    roomStatus: {
        type: String,
        required: true,
    },
    players: {
        type: Object,
        default: {},
        properties: {
            color: {
                type: String,
            },
            timeLeft: {
                type: Number,
            },
        },
    },
    moves: {
        type: Array,
        default: [],
    },
    fenString: {
        type: String,
        default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        required: true,
    }
});
const RoomModel = mongoose_1.default.model("Room", RoomSchema);
exports.RoomModel = RoomModel;
//# sourceMappingURL=RoomModel.js.map