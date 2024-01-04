/**
 * @jest-environment node
 */
import Game from "./Game.js";
import { JSDOM } from "jsdom";
import { formatTime } from "../misc/timeHelper.js";
jest.useFakeTimers();

describe("Game Initialization", () => {
  let dom;
  let game;

  beforeEach(() => {
    dom = new JSDOM(
      '<html><body><div class="timer-white"></div><div class="timer-black"></div></body></html>',
    );

    global.document = dom.window.document;
    global.window = dom.window;

    game = new Game();
    game.runGame();
  });

  it("Should have pieces automatically added to the board", () => {
    const pieces = game.board.getAllPiecesFromGrid();

    // Expectation on run game is should be that there are pieces on the board.
    expect(pieces.length).toBeGreaterThan(0);
  });

  it("Should initialize timers with proper formatting", () => {
    // Expectation on run game should be that the white timer is initialized and properly formatted.
    expect(game.players.white.timerElement.textContent).toBe(
      formatTime(game.timeControl.initialTime),
    );

    // Expectation on run game should be that the black timer is initialized and properly formatted.
    expect(game.players.black.timerElement.textContent).toBe(
      formatTime(game.timeControl.initialTime),
    );
  });
});

// Test case: Should switch active player correctly.
it("Should switch active player correctly.", () => {
  const game = new Game();
  game.runGame();

  // Expectation that the initial active player to be the white player.
  expect(game.currentPlayer).toBe(game.players.white);

  // Switching the active player to black.
  game.switchCurrentPlayer();

  // Expectation that the active player to be the black player.
  expect(game.currentPlayer).toBe(game.players.black);

  // Switching the active player back to white.
  game.switchCurrentPlayer();

  // Expectation that the active player to be the white player again.
  expect(game.currentPlayer).toBe(game.players.white);
});

// Describe block for handling game state detections.
describe("Handle detection on game states", () => {
  // Test case: Checkmate detection.
  it("Should handle checkmate", () => {
    // Setting up a specific FEN string for checkmate scenario.
    const game = new Game("7k/5Q2/5K2/8/8/8/8/8 w - - 0 1");

    // Running the game logic.
    game.runGame();

    // Moving the white queen to create a checkmate.
    const whiteQueen = game.board.getPieceFromGrid({ row: 6, col: 5 });
    whiteQueen.moveToTile({ row: 6, col: 6 });

    // Expectation game over, winner is white, and checkmate occurred.
    expect(game.state.gameOver).toBe(true);
    expect(game.state.winner.color).toBe("white");
    expect(game.state.winType.checkmate).toBe(true);
  });

  // Test case: Stalemate detection.
  it("Should handle stalemate", () => {
    // Setting up a specific FEN string for stalemate scenario.
    const game = new Game("7k/8/5QK1/8/8/8/8/8 w - - 0 1");

    // Running the game logic.
    game.runGame();

    // Moving the white queen to create a stalemate.
    const whiteQueen = game.board.getPieceFromGrid({ row: 5, col: 5 });
    whiteQueen.moveToTile({ row: 6, col: 5 });

    // Expectation game over, no winner, and stalemate occurred.
    expect(game.state.gameOver).toBe(true);
    expect(game.state.winner).toBeNull();
    expect(game.state.winType.stalemate).toBe(true);
  });

  // Test case: Insufficient Material detection.
  it("Should handle insufficient Material", () => {
    // Setting up a specific FEN string for insufficient material scenario.
    const game = new Game("8/8/8/8/2k5/8/1n6/K7 w - - 0 1");
    game.runGame();

    // Moving the white king to create insufficient material scenario.
    const whiteKing = game.board.getPieceFromGrid({ row: 0, col: 0 });
    whiteKing.moveToTile({ row: 1, col: 1 });

    // Expectation game over, no winner, and insufficient material occurred.
    expect(game.state.gameOver).toBe(true);
    expect(game.state.winner).toBeNull();
    expect(game.state.winType.insufficientMaterial).toBe(true);
  });
});
