/**
 * @jest-environment node
 */
import Game from "../Game/Game.js";
import { JSDOM } from "jsdom";
import King from "./King.js";
import Queen from "./Queen.js";
jest.useFakeTimers();

// Test case: Should initialize the DOM elements of pieces on the chessboard.
it("Should initialize the dom elements of pieces in the chessboard", () => {
  const dom = new JSDOM(
    '<html><body><article id="chessboard"></article></body></html>',
  );

  global.document = dom.window.document;
  global.window = dom.window;

  const game = new Game();

  // Create an array of pieces.
  const pieces = [
    new King({ row: 1, col: 1 }, game.players.white, "king", game),
    new Queen({ row: 2, col: 1 }, game.players.white, "queen", game),
    new King({ row: 3, col: 1 }, game.players.black, "king", game),
  ];

  // Set the specified pieces on the grid.
  pieces.forEach((piece) => game.board.setPieceFromGrid(piece));

  // Define the expected pieces with their attributes.
  const expectedPieces = [
    { src: "public/images/pieces/white-king.png", row: 1, col: 1 },
    { src: "public/images/pieces/white-queen.png", row: 2, col: 1 },
    { src: "public/images/pieces/black-king.png", row: 3, col: 1 },
  ];

  // Create the expected HTML string based on the expected pieces.
  const expectedHTML = expectedPieces
    .map(
      (piece) =>
        `<img src="${piece.src}" data-row="${piece.row}" data-col="${piece.col}" draggable="true">`,
    )
    .join("");

  // Expectation: Check if the game's DOM element contains the expected HTML.
  expect(game.domElement.innerHTML).toContain(expectedHTML);
});

// Test case: Shouldn't be able to move if 'x-rayed' (revealing check on king after move).
it("Shouldn't be able to move if 'x-rayed' (revealing check on king after move)", () => {
  const game = new Game(
    "rnbqk1nr/pppppppp/8/8/1b6/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );

  game.runGame();

  // Retrieve the white pawn at a specific position.
  const whitePawn = game.board.getPieceFromGrid({ row: 1, col: 3 });

  // Set the legal moves for the white pawn.
  const legalMoves = whitePawn.setLegalMoves();

  // Expectation: Check that the legal moves array has a length of 0.
  expect(legalMoves).toHaveLength(0);
});

describe("Legality of castling", () => {
  const castleMove = { row: 0, col: 6 };

  // Test case: Shouldn't be possible to castle if king has moved.
  it("Shouldn't be possible to castle if king has moved", () => {
    const game = new Game(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQK2R w KQkq - 0 1",
    );

    game.runGame();

    // Retrieve the white king at a specific position and mark it as moved.
    const whiteKing = game.board.getPieceFromGrid({ row: 0, col: 4 });
    whiteKing.hasMoved = true;

    // Check if castling to the specified position is legal.
    const isCastlingLegal = whiteKing
      .setLegalMoves()
      .some((obj) => obj.row === castleMove.row && obj.col === castleMove.col);

    // Expectation: Check that castling is not legal.
    expect(isCastlingLegal).toBeFalsy();
  });

  // Test case: Shouldn't be possible to castle if rook has moved.
  it("Shouldn't be possible to castle if rook has moved", () => {
    const game = new Game(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQK2R w KQkq - 0 1",
    );

    game.runGame();

    // Retrieve the white king and rook at specific positions and mark rook as moved.
    const whiteKing = game.board.getPieceFromGrid({ row: 0, col: 4 });
    const whiteRook = game.board.getPieceFromGrid({ row: 0, col: 7 });
    whiteRook.hasMoved = true;

    // Check if castling to the specified position is legal.
    const isCastlingLegal = whiteKing
      .setLegalMoves()
      .some((obj) => obj.row === castleMove.row && obj.col === castleMove.col);

    // Expectation: Check that castling is not legal.
    expect(isCastlingLegal).toBeFalsy();
  });

  // Test case: Shouldn't be possible to castle if king is in check during moving.
  it("Shouldn't be possible to castle if king is in check during moving", () => {
    const game = new Game("1nbqk1r1/ppppp2p/8/8/8/8/PPPPP2P/RNBQK2R w K - 0 1");

    game.runGame();

    // Retrieve the white king at a specific position.
    const whiteKing = game.board.getPieceFromGrid({ row: 0, col: 4 });

    // Check if castling to the specified position is legal.
    const isCastlingLegal = whiteKing
      .setLegalMoves()
      .some((obj) => obj.row === castleMove.row && obj.col === castleMove.col);

    // Expectation: Check that castling is not legal.
    expect(isCastlingLegal).toBeFalsy();
  });

  // Test case: Shouldn't be possible if there are pieces in between the king and rook.
  it("Shouldn't be possible if there are pieces in between the king and rook", () => {
    const game = new Game();

    game.runGame();

    // Retrieve the white king at a specific position.
    const whiteKing = game.board.getPieceFromGrid({ row: 0, col: 4 });

    // Check if castling to the specified position is legal.
    const isCastlingLegal = whiteKing
      .setLegalMoves()
      .some((obj) => obj.row === castleMove.row && obj.col === castleMove.col);

    // Expectation: Check that castling is not legal.
    expect(isCastlingLegal).toBeFalsy();
  });

  // Test case: Should be possible if both rook and king haven't moved, and the king is safe while moving.
  it("Should be possible if both rook and king haven't moved, and the king is safe while moving", () => {
    const game = new Game(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQK2R w KQkq - 0 1",
    );

    game.runGame();

    // Retrieve the white king at a specific position.
    const whiteKing = game.board.getPieceFromGrid({ row: 0, col: 4 });

    // Check if castling to the specified position is legal.
    const isCastlingLegal = whiteKing
      .setLegalMoves()
      .some((obj) => obj.row === castleMove.row && obj.col === castleMove.col);

    // Expectation: Check that castling is legal.
    expect(isCastlingLegal).toBeTruthy();
  });
});

describe("Legality of en-passant", () => {
  const enPassantMove = { row: 5, col: 5 };

  it("Should not be possible if the last move wasn't made by the side pawn.", () => {
    const game = new Game(
      "rnbqkbnr/ppppp1pp/8/4Pp2/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
    );

    game.runGame();

    // Retrieve the white pawn at a specific position.
    const whitePawn = game.board.getPieceFromGrid({ row: 4, col: 4 });

    // Check if en-passant to the specified position is legal.
    const isEnPassantLegal = whitePawn
      .setLegalMoves()
      .some(
        (obj) => obj.row === enPassantMove.row && obj.col === enPassantMove.col,
      );

    // Expectation: Check that en-passant is not legal.
    expect(isEnPassantLegal).toBeFalsy();

    // Edge case: white pawn can't make the invalid move.
    whitePawn.moveToTile({ row: 4, col: 5 });

    // Expectation: Position of white pawn is still the same as before.
    expect(whitePawn.position).toEqual({ row: 4, col: 4 });
  });

  // Test case: Should be possible if last moved pawn has moved two steps, is next to the other pawn and on the en-passant row.
  it("Should be possible if all conditions are met", () => {
    const game = new Game(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
    );

    game.runGame();

    // Retrieve the white pawn at a specific position.
    const whitePawn = game.board.getPieceFromGrid({ row: 3, col: 4 });
    whitePawn.moveToTile({ row: 4, col: 4 });

    // Expectation: Pawn is on the correct en-passant row.
    const isOnEnPassantRow = whitePawn.enPassantRow === whitePawn.position.row;
    expect(isOnEnPassantRow).toBeTruthy();

    // Move black pawn so that it validates the en-passant rule.
    const blackPawn = game.board.getPieceFromGrid({ row: 6, col: 5 });
    blackPawn.moveToTile({ row: 4, col: 5 });

    // Check if en-passant to the specified position is legal.
    const isEnPassantLegal = whitePawn
      .setLegalMoves()
      .some(
        (obj) => obj.row === enPassantMove.row && obj.col === enPassantMove.col,
      );

    // Expectation: Check that en-passant is legal.
    expect(isEnPassantLegal).toBeTruthy();
  });
});

// Test case: Should change the data values of the dom element on movement.
it("Should change the data values of the dom element on movement.", () => {
  const dom = new JSDOM(
    '<html><body><article id="chessboard"></article></body></html>',
  );

  global.document = dom.window.document;
  global.window = dom.window;

  const game = new Game();

  game.runGame();

  // Retrieve the white pawn and check if the initialization gets the correct data.
  const whitePawn = game.board.getPieceFromGrid({ row: 1, col: 3 });
  expect(whitePawn.domElement.outerHTML).toContain(
    '<img src="public/images/pieces/white-pawn.png" data-row="1" data-col="3" draggable="true">',
  );

  // Make movement.
  whitePawn.moveToTile({ row: 2, col: 3 });

  // Expectation: The white pawn has it's data-row and -col changed.
  expect(whitePawn.domElement.outerHTML).toContain(
    '<img src="public/images/pieces/white-pawn.png" data-row="2" data-col="3" draggable="true">',
  );
});

// Test case: Shouldn't make moves if they are not valid.
it("Shouldn't make moves if they are not valid.", () => {
  const game = new Game();
  game.runGame();

  // Retrieve the white pawn and check if the initialization gets the correct data.
  const initialPosition = { row: 1, col: 3 };
  const whitePawn = game.board.getPieceFromGrid(initialPosition);

  // Make illegal move (2 up, 2 right).
  whitePawn.moveToTile(initialPosition);

  // Expectation: The white pawn still has it's original position, as an illegal move has been made (so it hasn't been fired)
  expect(whitePawn.position).toEqual(initialPosition);

  // Expectation: The current player is still white, as the move hasn't been made (as it's illegal).
  expect(game.currentPlayer).toEqual(game.players.white);
});
