"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function connectToDB() {
    let uri;
    if (process.env.DB_USER) {
        uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.${process.env.DB_NAME}.mongodb.net/`;
    }
    if (uri) {
        mongoose_1.default
            .connect(uri)
            .then(() => {
            console.log("Connected to Database");
        })
            .catch((err) => {
            throw err;
        });
    }
}
exports.connectToDB = connectToDB;
//# sourceMappingURL=connectToDB.js.map