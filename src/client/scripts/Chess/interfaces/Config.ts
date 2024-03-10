/**
 * Interface for the configuration of the game
 */
interface Config {
  player?: string;
  fen?: string;
  pieceTheme?: string;
  moves?: [];
  whiteTime: number;
  blackTime: number;
}

export { Config };