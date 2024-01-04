/**
 * @jest-environment node
 */
import Game from "./Game.js";
import { JSDOM } from "jsdom";
jest.useFakeTimers();

describe("Player Captures", () => {
  let game;
  let dom;

  beforeEach(() => {
    dom = new JSDOM(
      '<html><body><div class="captures-white"><div class="pawn"></div></div></body></html>',
    );

    global.document = dom.window.document;
    global.window = dom.window;

    game = new Game(
      "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
    );
    game.runGame();

    // Expectation on run game should be 0, as no captures have taken place.
    expect(game.players.white.captures).toHaveLength(0);

    // Get Pawn and capture a piece.
    const whitePawn = game.board.getPieceFromGrid({ row: 3, col: 4 });
    whitePawn.moveToTile({ row: 4, col: 3 });
  });

  it("Should add a capture to the players capture array", () => {
    // Expectation on capture of piece should be 1, as one piece has been captured.
    expect(game.players.white.captures).toHaveLength(1);
  });

  it("Should display the captured piece in the HTML", () => {
    // Get capture element of list of pawns.
    const captureElement =
      game.players.white.capturesElement.querySelector(".pawn");

    // Expectation on capture of piece should be that image of the (captured) piece is added to the HTML.
    expect(captureElement.innerHTML).toContain(
      '<img src="public/images/pieces/black-pawn.png">',
    );
  });
});

describe("Player Moves", () => {
  let game;

  beforeEach(() => {
    const dom = new JSDOM(
      '<html><body><aside><div class="move-list"></div></aside></body></html>',
    );

    global.document = dom.window.document;
    global.window = dom.window;

    game = new Game();
    game.runGame();

    // Expectation on run game should be 0, as no moves have been played.
    expect(game.players.white.moves).toHaveLength(0);
  });

  it("Should add a move to the players move array.", () => {
    // Get Pawn and move it to a tile.
    const whitePawn = game.board.getPieceFromGrid({ row: 1, col: 4 });
    whitePawn.moveToTile({ row: 3, col: 4 });

    // Expectation on move should be 1, as one move has been played.
    expect(game.players.white.moves).toHaveLength(1);

    // Edge case: moving incorrect color piece.
    const illegalWhitePawn = game.board.getPieceFromGrid({ row: 3, col: 4 });
    illegalWhitePawn.moveToTile({ row: 4, col: 4 });

    // Expectation on move of two pieces of the same color should be no move added.
    expect(game.players.white.moves).toHaveLength(1);
  });

  it("Should create a DOM element for each move played.", () => {
    // Get score element
    const scoreElement = game.moveListElement;

    // Get Pawn and move it to a tile.
    const whitePawn = game.board.getPieceFromGrid({ row: 1, col: 4 });
    whitePawn.moveToTile({ row: 3, col: 4 });

    // Expectation on capture of piece should be that a DOM element is created with the correct turn and move.
    expect(scoreElement.innerHTML).toContain(
      '<div class="turn"><span>e4</span></div>',
    );
  });
});

it("Should start the timer interval correctly and decrease time every second.", () => {
  const game = new Game();
  game.runGame();

  let whiteTime = game.timeControl.initialTime;
  let blackTime = game.timeControl.initialTime;
  const timeIncrement = game.timeControl.increment;

  // Expectation on run game should be 0, as no captures have taken place.
  expect(game.players.white.time).toBe(whiteTime);
  expect(game.players.black.time).toBe(blackTime);

  // Edge case: timer doesn't start until first move.
  jest.advanceTimersByTime(10000);

  // Expectation before switching player should be no time lost, as timing only starts after first move.
  expect(game.players.white.time).toBe(whiteTime);

  game.switchCurrentPlayer();

  // Expectation should be to have the time plus increment added.
  expect(game.players.white.time).toBe((whiteTime += timeIncrement));

  // Advance 10 seconds.
  jest.advanceTimersByTime(10000);

  // Expectation after switching player should be time minus amount of seconds.
  expect(game.players.black.time).toBe((blackTime -= 10));
});

it("Should initalize the classes correctly (based on color).", () => {
  const game = new Game();
  game.runGame();

  // Expectation on run game should be that the advantageDirection is calculated based on color.
  expect(game.players.white.advantageDirection).toBe(1);
  expect(game.players.black.advantageDirection).toBe(-1);
});
