"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomName = void 0;
const BASE = 36;
const SUBSTRING_START = 4;
function generateRandomName() {
  return Math.random().toString(BASE).substring(SUBSTRING_START);
}
exports.generateRandomName = generateRandomName;
//# sourceMappingURL=generateRoomName.js.map
