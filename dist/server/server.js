"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_js_1 = __importDefault(require("./router/router.js"));
const findAvailableRoom_js_1 = require("./misc/functions/findAvailableRoom.js");
const generateRoom_js_1 = require("./misc/functions/generateRoom.js");
const findAndDeletePlayerInRoom_js_1 = require("./misc/functions/findAndDeletePlayerInRoom.js");
const getPlayerAmount_js_1 = require("./misc/functions/getPlayerAmount.js");
const RoomData_js_1 = require("./misc/enums/RoomData.js");
const handleConnection_js_1 = require("./misc/functions/handleConnection.js");
const connectToDB_js_1 = require("./misc/config/connectToDB.js");
const updateToDB_js_1 = require("./misc/functions/updateToDB.js");
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 3000;
const SIXTY_SECONDS = 60 * 1000;
class App {
    constructor(port) {
        this.port = port;
        this.disconnectTimeouts = new Map();
        const app = (0, express_1.default)();
        this.server = new http_1.default.Server(app);
        this.io = new socket_io_1.Server(this.server);
        this.rooms = new Map();
        app
            .set("view engine", "njk")
            .set("views", "src/views/")
            .set("socketio", this.io);
        app
            .use(express_1.default.static("dist/client"))
            .use(express_1.default.urlencoded({ extended: true }))
            .use(express_1.default.json())
            .use((0, cookie_parser_1.default)())
            .use(this.attachPlayerIDToRequest)
            .use("/", router_js_1.default);
        nunjucks_1.default.configure("src/views/", {
            autoescape: true,
            express: app,
        });
        this.io.on("connection", (socket) => {
            console.log(`An user connected: ${socket.id}`);
            this.handleUserConnection(socket);
        });
    }
    attachPlayerIDToRequest(req, res, next) {
        // Middleware to attach playerID to the request object
        const playerID = req.cookies.playerID;
        req.playerID = playerID;
        next();
    }
    handleUserConnection(socket) {
        console.log(`An user connected: ${socket.id}`);
        const playerID = (0, handleConnection_js_1.handleConnection)(socket);
        const inRoom = (0, findAndDeletePlayerInRoom_js_1.findRoomFromPlayer)(this.rooms, playerID);
        // Clear the timeout if the player reconnects
        const disconnectTimeout = this.disconnectTimeouts.get(playerID);
        if (disconnectTimeout) {
            clearTimeout(disconnectTimeout);
            this.disconnectTimeouts.delete(playerID);
            console.log(`Player reconnected within the timeout: ${socket.id}`);
        }
        if (inRoom) {
            this.handleUserReconnection(socket, inRoom, playerID);
            this.io.to(inRoom.roomName).emit("unfreeze");
            this.io.to(inRoom.roomName).emit("cleanup");
        }
        socket.on("startQueue", async () => {
            this.handleStartQueue(socket, playerID);
        });
        socket.on("move", (madeMove, color) => {
            this.handleMove(socket, playerID, madeMove, color);
        });
        socket.on("updateTime", async (time, color) => {
            this.handleUpdateTime(socket, playerID, time, color);
        });
        socket.on("returnToLobby", async () => {
            this.handleReturnToLobby(socket, playerID);
        });
        socket.on("disconnect", async () => {
            this.handleUserDisconnect(socket, playerID);
        });
    }
    handleUserReconnection(socket, inRoom, playerID) {
        (0, handleConnection_js_1.handleReconnection)(socket, inRoom, playerID);
        this.io.to(inRoom.roomName).emit("unfreeze");
        this.io.to(inRoom.roomName).emit("cleanup");
    }
    async handleStartQueue(socket, playerID) {
        try {
            let room = await (0, findAvailableRoom_js_1.findAvailableRoom)(this.rooms, playerID);
            if (!room) {
                room = await (0, generateRoom_js_1.generateRoom)(playerID);
            }
            socket.join(room.roomName);
            this.rooms.set(room.roomName, room);
            if ((0, getPlayerAmount_js_1.getPlayerAmount)(room) < RoomData_js_1.RoomData.MAX_PLAYERS) {
                socket.emit("isInQueue", room.roomName, room.roomStatus);
            }
            else {
                this.io.to(room.roomName).emit("joinMatch", room.roomName);
                room.roomStatus = RoomData_js_1.RoomStatus.PLAYING;
            }
            // Log players for each room
            this.rooms.forEach((room, roomKey) => {
                console.log(`Players in room ${roomKey}:`, room.players);
            });
        }
        catch (error) {
            console.error("Error starting queue:", error);
        }
    }
    handleMove(socket, playerID, madeMove, color) {
        const room = (0, findAndDeletePlayerInRoom_js_1.findRoomFromPlayer)(this.rooms, playerID);
        // To avoid duplication of made move
        const playerColor = room.players[playerID].color;
        if (color !== playerColor) {
            (0, updateToDB_js_1.updateMoveToDB)(room.roomName, madeMove);
            this.io.to(room.roomName).emit("movePiece", madeMove);
        }
    }
    handleUpdateTime(socket, playerID, time, color) {
        const room = (0, findAndDeletePlayerInRoom_js_1.findRoomFromPlayer)(this.rooms, playerID);
        if (room) {
            (0, updateToDB_js_1.updateTimeToDB)(room.roomName, playerID, color, time);
        }
    }
    handleReturnToLobby(socket, playerID) {
        (0, findAndDeletePlayerInRoom_js_1.findAndDeletePlayerInRoom)(this.rooms, playerID);
        socket.emit("sendToHome");
    }
    handleUserDisconnect(socket, playerID) {
        const room = (0, findAndDeletePlayerInRoom_js_1.findRoomFromPlayer)(this.rooms, playerID);
        if (room && room.roomStatus === RoomData_js_1.RoomStatus.WAITING) {
            (0, findAndDeletePlayerInRoom_js_1.findAndDeletePlayerInRoom)(this.rooms, playerID);
        }
        if (room && room.roomStatus === RoomData_js_1.RoomStatus.PLAYING) {
            this.io.to(room.roomName).emit("freeze");
            const disconnectTime = SIXTY_SECONDS;
            this.io.to(room.roomName).emit("disconnectNotification", disconnectTime);
            const disconnectTimeout = setTimeout(async () => {
                this.io.to(room.roomName).emit("disconnectEnd");
                console.log(`Game ended due to player disconnect: ${socket.id}`);
            }, disconnectTime);
            // Store the timeout associated with the player
            this.disconnectTimeouts.set(playerID, disconnectTimeout);
        }
        console.log(`An user disconnected: ${socket.id}`);
    }
    start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}`);
        });
        (0, connectToDB_js_1.connectToDB)();
    }
}
const app = new App(PORT);
exports.app = app;
app.start();
//# sourceMappingURL=server.js.map