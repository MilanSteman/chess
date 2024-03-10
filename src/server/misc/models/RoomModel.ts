import mongoose, { Model, Schema } from "mongoose";
import { Room } from "../interfaces/Room";

const RoomSchema: Schema = new mongoose.Schema({
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

const RoomModel: Model<Room> = mongoose.model<Room>("Room", RoomSchema);

export { RoomModel };