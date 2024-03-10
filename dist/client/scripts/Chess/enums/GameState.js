/**
 * Enum for determining the game status
 */
var GameStatus;
(function (GameStatus) {
    GameStatus["WAITING"] = "waiting";
    GameStatus["PLAYING"] = "playing";
    GameStatus["GAME_OVER"] = "gameOver";
})(GameStatus || (GameStatus = {}));
var GameEndTypes;
(function (GameEndTypes) {
    GameEndTypes["CHECKMATE"] = "checkmate";
    GameEndTypes["STALEMATE"] = "stalemate";
    GameEndTypes["INSUFFICIENT_MATERIAL"] = "insufficientMaterial";
    GameEndTypes["TIME"] = "time";
    GameEndTypes["DISCONNECT"] = "disconnect";
})(GameEndTypes || (GameEndTypes = {}));
export { GameStatus, GameEndTypes };
