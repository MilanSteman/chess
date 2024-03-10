"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomName = void 0;
const BASE = 36;
const SUBSTRING_START = 4;
/**
 * Generates a random string that can be used as a unique identifier or name.
 * @returns A random string with alphanumeric characters.
 */
function generateRandomName() {
    return Math.random().toString(BASE).substring(SUBSTRING_START);
}
exports.generateRandomName = generateRandomName;
//# sourceMappingURL=generateRandomName.js.map