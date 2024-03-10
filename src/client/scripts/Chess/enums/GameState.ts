/**
 * Enum for determining the game status
 */
enum GameStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  GAME_OVER = 'gameOver',
}

enum GameEndTypes {
  CHECKMATE = 'checkmate',
  STALEMATE = 'stalemate',
  INSUFFICIENT_MATERIAL = 'insufficientMaterial',
  TIME = 'time',
  DISCONNECT = 'disconnect',
}

export { GameStatus, GameEndTypes };