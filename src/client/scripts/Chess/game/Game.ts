import { Board } from "./Board.js";
import { Players } from "../enums/Players.js";
import { Player } from "./Player.js";
import { findAllPiecesFromPlayer } from "../misc/findPieceFromGrid.js";
import { isInCheck } from "../misc/isInCheck.js";
import { GameEndTypes, GameStatus } from "../enums/GameState.js";
import { hasInsufficientMaterial } from "../misc/insufficientMaterial.js";
import { capitalizeFirstLetter } from "../misc/capitalizeFirstLetter.js";
import { Config } from "../interfaces/Config.js";
import client from "../../client.js";
import { MadeMove } from "../interfaces/Move.js";
import { Piece } from "../pieces/Piece.js";

/**
 * Represents a chess game
 */
class Game {
  // Default configuration for the game
  private static DEFAULT_CONFIG: { player: string, fen: string, pieceTheme: string, moves: [], whiteTime: number, blackTime: number } = {
    player: Players.WHITE,
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    pieceTheme: "classic",
    moves: [],
    whiteTime: 1200,
    blackTime: 1200,
  };

  public static currentPlayer: Player | null;
  public static players: { [key in Players]: Player };
  private static _advantage: number;
  private static _state: { status: string | null, winner: Player | null, endType: string | null };
  public static pieceTheme: string;
  public static move: number;
  public static allowMovements: boolean;

  public static player: string;
  private readonly board: Board;
  private readonly fen: string;
  private gameEl: HTMLDivElement;
  public static moveSpeed: number;
  public static moves: [];
  public static timeControl: { initialTime: number, increment: number, whiteTime: number, blackTime: number };

  /**
   * Constructor for the Game class
   */
  constructor(config?: Config) {
    // Set player and FEN from the provided config or use the default values
    Game.player = config?.player ?? Game.DEFAULT_CONFIG.player;
    Game.moves = config?.moves ?? Game.DEFAULT_CONFIG.moves;
    this.fen = config?.fen ?? Game.DEFAULT_CONFIG.fen;

    this.gameEl = document.createElement('div');

    // Initialize theme
    Game.pieceTheme = config?.pieceTheme ?? Game.DEFAULT_CONFIG.pieceTheme;

    // Initialize advantage
    Game._advantage = 0;


    Game.timeControl = {
      initialTime: 1200,
      increment: 0,
      whiteTime: config?.whiteTime || Game.timeControl.initialTime,
      blackTime: config?.blackTime || Game.timeControl.initialTime,
    };

    // Initializes both players
    Game.players = {
      [Players.WHITE]: new Player(Players.WHITE),
      [Players.BLACK]: new Player(Players.BLACK),
    }

    // Initialize the current player to WHITE and create a new game board
    Game.currentPlayer = Game.players[Players.WHITE];

    Game.allowMovements = true;

    Game.moveSpeed = 200;

    Game._state = {
      status: null,
      winner: null,
      endType: null,
    };

    Game.move = 1;

    // Initialize a new board
    this.board = new Board();

    // Create the DOM of the game
    this.createGame();

    client.socket.on("movePiece", (moveData: MadeMove) => {
      const makeMove = ({ fromRow, fromCol, toRow, toCol }: MadeMove) => {
        const instance: Piece | null = Board.grid[fromRow][fromCol];
        instance?.MoveableMixin.makeMove(instance, toRow, toCol);
      };

      if (!Game.allowMovements) {
        Board.revertBoardState();

        // Set a timeout of Gamespeed here, to make the correct move appear.
        setTimeout(() => {
          makeMove(moveData);
        }, Game.moveSpeed);
      } else {
        makeMove(moveData);
      }
    });

    /**
     * Freezes the game in place
     */
    client.socket.on("freeze", (): void => {
      for (const color of Object.values(Players)) {
        const player: Player = Game.players[color];
        player.pauseTimer();
        Game.allowMovements = false;
      }
    });

    /**
     * Unfreezes a frozen game
     */
    client.socket.on("unfreeze", (): void => {
      Game.allowMovements = true;
      Game.currentPlayer?.startTimer();
    });

    /**
     * Updates the game on disconnect
     */
    client.socket.on("disconnectEnd", (): void => {
      const winner: Player = Game.player === Players.WHITE ? Game.players.white : Game.players.black;
      Game.state = { ...Game.state, ...{ status: GameStatus.GAME_OVER, winner: winner, endType: GameEndTypes.DISCONNECT } };
    });
  }

  /**
   * Getter for the game state property
   * @returns The current game state
   */
  static get state(): { status: string | null, winner: Player | null, endType: string | null } {
    return Game._state;
  }

  /**
   * Setter for the game state property
   */
  static set state(newState: { status: string | null, winner: Player | null, endType: string | null }) {
    Game._state = newState;

    if (newState.status === GameStatus.GAME_OVER) {
      // Create game over modal
      const modal: HTMLDivElement = document.createElement("div");
      modal.classList.add("game-modal");

      const winnerEl: HTMLSpanElement = document.createElement("span");
      winnerEl.textContent = Game.state.winner ? (Game.state.winner.color === Players.WHITE ? `${capitalizeFirstLetter(Players.WHITE)} won` : `${capitalizeFirstLetter(Players.BLACK)} won`) : "Tie";

      const gameEndTypeEl: HTMLSpanElement = document.createElement("span");
      gameEndTypeEl.textContent = `By ${Game.state.endType === GameEndTypes.INSUFFICIENT_MATERIAL ? "Insufficient Material" : Game.state.endType}`;

      const button: HTMLButtonElement = document.createElement("button");
      button.textContent = "Return to lobby";
      button.addEventListener("click", () => {
        client.socket.emit("returnToLobby");
      });

      modal.appendChild(winnerEl);
      modal.appendChild(gameEndTypeEl);
      modal.appendChild(button);
      Board.boardDomEl.appendChild(modal);

      // Run end sound
      const gameEndAudio = new Audio("/audio/game-end.mp3");
      gameEndAudio.play();

      // End running game properties
      Game.currentPlayer?.pauseTimer();
      Game.currentPlayer === null;
    }
  }

  /**
   * Getter for the advantage property
   * @returns The current advantage value
   */
  static get advantage(): number {
    return Game._advantage;
  }

  /**
   * Setter for the advantage property
   */
  static set advantage(newAdvantage: number) {
    // Remove any existing advantage elements 
    document.querySelectorAll(".captured-pieces > span").forEach((advantageEl) => {
      advantageEl.remove();
    });

    // Determine if there is an advantage and the player with the advantage
    const hasAdvantage = newAdvantage === 0 ? null : newAdvantage > 0 ? Game.players[Players.WHITE] : Game.players[Players.BLACK];

    if (hasAdvantage) {
      // Get the captured pieces element of the player with the advantage
      const capturedPiecesEl: HTMLDivElement | null = document.querySelector(`.${hasAdvantage.color}-sidebar .captured-pieces`);

      // Create a new element to display the advantage
      const advantageEl: HTMLSpanElement = document.createElement('span');
      advantageEl.textContent = `+${Math.abs(newAdvantage)}`;

      // Append the advantage element to the captured pieces area
      capturedPiecesEl?.appendChild(advantageEl);
    }

    Game._advantage = newAdvantage;
  }


  /**
   * Starts the chess game by rendering the board and setting the initial position
   */
  public start(): void {
    Game.state = { ...Game.state, ...{ status: GameStatus.PLAYING } };
    // Append the game board to the main
    document.querySelector("main")?.appendChild(this.gameEl);

    // Set the initial position of the board based on the FEN notation
    this.board.setPosition(this.fen);

    // Play audio
    const gameStartAudio = new Audio("/audio/game-start.mp3");
    gameStartAudio.play();

    if (Game.moves && Board.grid) {
      Game.moves.forEach(move => {
        const { fromRow, fromCol, toRow, toCol } = move;
        const instance: Piece | null = Board.grid[fromRow][fromCol];
        instance?.MoveableMixin.makeMove(instance, toRow, toCol);
      });
    }

    for (const color of Object.values(Players)) {
      const player = Game.players[color];
      player.setTimer();
    }
  }

  /**
   * Creates the necessary DOM structure for the game
   */
  private createGame(): void {
    // Create game wrapper
    this.gameEl.classList.add("game");

    this.createMainWrapper();
    this.createSideWrapper();
  }

  /**
   * Creates the necessary DOM structure for the main wrapper (chessboard, interface player)
   */
  private createMainWrapper(): void {
    // Create main wrapper
    const mainWrapper: HTMLDivElement = document.createElement('div');
    mainWrapper.classList.add("main");
    Game.player === Players.BLACK && mainWrapper.classList.add("reversed");

    // Append the interface element of the BLACK player
    mainWrapper.appendChild(Game.players[Players.BLACK].interfaceEl);

    // Append chessboard
    mainWrapper.appendChild(Board.boardDomEl);

    // Append the interface element of the WHITE player
    mainWrapper.appendChild(Game.players[Players.WHITE].interfaceEl);

    this.gameEl.appendChild(mainWrapper);
  }

  /**
   * Creates the necessary DOM structure for the side wrapper (moves, buttons)
   */
  private createSideWrapper(): void {
    // Create side wrapper
    const sideWrapper: HTMLDivElement = document.createElement('div');
    sideWrapper.classList.add("side");

    const moveList: HTMLDivElement = document.createElement("div");
    moveList.classList.add("list");

    sideWrapper.appendChild(moveList);
    this.gameEl.appendChild(sideWrapper);
  }

  /**
   * Switches the current player between white and black
   */
  static switchCurrentPlayer(): void {
    if (Game.currentPlayer) {
      Game.currentPlayer.time += Game.timeControl.increment;
      Game.currentPlayer.pauseTimer();

      Game.currentPlayer = Game.currentPlayer === Game.players[Players.WHITE] ? Game.players[Players.BLACK] : Game.players[Players.WHITE];

      Game.currentPlayer.startTimer();

      Game.handleGameState();
    }
  }

  /**
   * Gets the opponent of the current player
   * @returns The opponent's player class (white or black)
   */
  static getOpponent(player?: Player | null): Player {
    if (player) {
      return player === Game.players[Players.WHITE] ? Game.players[Players.BLACK] : Game.players[Players.WHITE];
    }

    return Game.currentPlayer === Game.players[Players.WHITE] ? Game.players[Players.BLACK] : Game.players[Players.WHITE];
  }

  static handleGameState(): void {
    const currentPlayerPieces = findAllPiecesFromPlayer(Board.grid, Game.currentPlayer?.color);
    const opponentPlayerPieces = findAllPiecesFromPlayer(Board.grid, Game.getOpponent().color);
    const hasMovesLeft = currentPlayerPieces?.some((piece) => piece.getLegalMoves().length);

    if (hasInsufficientMaterial(currentPlayerPieces, opponentPlayerPieces)) {
      Game.state = { ...Game.state, ...{ status: GameStatus.GAME_OVER, winner: null, endType: GameEndTypes.INSUFFICIENT_MATERIAL } };
      return;
    }

    // If player is not in checkmate
    if (hasMovesLeft) {
      return;
    }

    // Checkmate
    if (isInCheck(Game.currentPlayer)) {
      Game.state = { ...Game.state, ...{ status: GameStatus.GAME_OVER, winner: Game.getOpponent(), endType: GameEndTypes.CHECKMATE } };
      return;
    }

    Game.state = { ...Game.state, ...{ status: GameStatus.GAME_OVER, winner: null, endType: GameEndTypes.STALEMATE } };
  }
}

export { Game };
