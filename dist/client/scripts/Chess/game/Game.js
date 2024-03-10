import { Board } from "./Board.js";
import { Players } from "../enums/Players.js";
import { Player } from "./Player.js";
import { findAllPiecesFromPlayer } from "../misc/findPieceFromGrid.js";
import { isInCheck } from "../misc/isInCheck.js";
import { GameEndTypes, GameStatus } from "../enums/GameState.js";
import { hasInsufficientMaterial } from "../misc/insufficientMaterial.js";
import { capitalizeFirstLetter } from "../misc/capitalizeFirstLetter.js";
import client from "../../client.js";
/**
 * Represents a chess game
 */
class Game {
    /**
     * Constructor for the Game class
     */
    constructor(config) {
        var _a, _b, _c, _d;
        // Set player and FEN from the provided config or use the default values
        Game.player = (_a = config === null || config === void 0 ? void 0 : config.player) !== null && _a !== void 0 ? _a : Game.DEFAULT_CONFIG.player;
        Game.moves = (_b = config === null || config === void 0 ? void 0 : config.moves) !== null && _b !== void 0 ? _b : Game.DEFAULT_CONFIG.moves;
        this.fen = (_c = config === null || config === void 0 ? void 0 : config.fen) !== null && _c !== void 0 ? _c : Game.DEFAULT_CONFIG.fen;
        this.gameEl = document.createElement('div');
        // Initialize theme
        Game.pieceTheme = (_d = config === null || config === void 0 ? void 0 : config.pieceTheme) !== null && _d !== void 0 ? _d : Game.DEFAULT_CONFIG.pieceTheme;
        // Initialize advantage
        Game._advantage = 0;
        Game.timeControl = {
            initialTime: 1200,
            increment: 0,
            whiteTime: (config === null || config === void 0 ? void 0 : config.whiteTime) || Game.timeControl.initialTime,
            blackTime: (config === null || config === void 0 ? void 0 : config.blackTime) || Game.timeControl.initialTime,
        };
        // Initializes both players
        Game.players = {
            [Players.WHITE]: new Player(Players.WHITE),
            [Players.BLACK]: new Player(Players.BLACK),
        };
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
        client.socket.on("movePiece", (moveData) => {
            const makeMove = ({ fromRow, fromCol, toRow, toCol }) => {
                const instance = Board.grid[fromRow][fromCol];
                instance === null || instance === void 0 ? void 0 : instance.MoveableMixin.makeMove(instance, toRow, toCol);
            };
            if (!Game.allowMovements) {
                Board.revertBoardState();
                // Set a timeout of Gamespeed here, to make the correct move appear.
                setTimeout(() => {
                    makeMove(moveData);
                }, Game.moveSpeed);
            }
            else {
                makeMove(moveData);
            }
        });
        /**
         * Freezes the game in place
         */
        client.socket.on("freeze", () => {
            for (const color of Object.values(Players)) {
                const player = Game.players[color];
                player.pauseTimer();
                Game.allowMovements = false;
            }
        });
        /**
         * Unfreezes a frozen game
         */
        client.socket.on("unfreeze", () => {
            var _a;
            Game.allowMovements = true;
            (_a = Game.currentPlayer) === null || _a === void 0 ? void 0 : _a.startTimer();
        });
        /**
         * Updates the game on disconnect
         */
        client.socket.on("disconnectEnd", () => {
            const winner = Game.player === Players.WHITE ? Game.players.white : Game.players.black;
            Game.state = Object.assign(Object.assign({}, Game.state), { status: GameStatus.GAME_OVER, winner: winner, endType: GameEndTypes.DISCONNECT });
        });
    }
    /**
     * Getter for the game state property
     * @returns The current game state
     */
    static get state() {
        return Game._state;
    }
    /**
     * Setter for the game state property
     */
    static set state(newState) {
        var _a;
        Game._state = newState;
        if (newState.status === GameStatus.GAME_OVER) {
            // Create game over modal
            const modal = document.createElement("div");
            modal.classList.add("game-modal");
            const winnerEl = document.createElement("span");
            winnerEl.textContent = Game.state.winner ? (Game.state.winner.color === Players.WHITE ? `${capitalizeFirstLetter(Players.WHITE)} won` : `${capitalizeFirstLetter(Players.BLACK)} won`) : "Tie";
            const gameEndTypeEl = document.createElement("span");
            gameEndTypeEl.textContent = `By ${Game.state.endType === GameEndTypes.INSUFFICIENT_MATERIAL ? "Insufficient Material" : Game.state.endType}`;
            const button = document.createElement("button");
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
            (_a = Game.currentPlayer) === null || _a === void 0 ? void 0 : _a.pauseTimer();
            Game.currentPlayer === null;
        }
    }
    /**
     * Getter for the advantage property
     * @returns The current advantage value
     */
    static get advantage() {
        return Game._advantage;
    }
    /**
     * Setter for the advantage property
     */
    static set advantage(newAdvantage) {
        // Remove any existing advantage elements 
        document.querySelectorAll(".captured-pieces > span").forEach((advantageEl) => {
            advantageEl.remove();
        });
        // Determine if there is an advantage and the player with the advantage
        const hasAdvantage = newAdvantage === 0 ? null : newAdvantage > 0 ? Game.players[Players.WHITE] : Game.players[Players.BLACK];
        if (hasAdvantage) {
            // Get the captured pieces element of the player with the advantage
            const capturedPiecesEl = document.querySelector(`.${hasAdvantage.color}-sidebar .captured-pieces`);
            // Create a new element to display the advantage
            const advantageEl = document.createElement('span');
            advantageEl.textContent = `+${Math.abs(newAdvantage)}`;
            // Append the advantage element to the captured pieces area
            capturedPiecesEl === null || capturedPiecesEl === void 0 ? void 0 : capturedPiecesEl.appendChild(advantageEl);
        }
        Game._advantage = newAdvantage;
    }
    /**
     * Starts the chess game by rendering the board and setting the initial position
     */
    start() {
        var _a;
        Game.state = Object.assign(Object.assign({}, Game.state), { status: GameStatus.PLAYING });
        // Append the game board to the main
        (_a = document.querySelector("main")) === null || _a === void 0 ? void 0 : _a.appendChild(this.gameEl);
        // Set the initial position of the board based on the FEN notation
        this.board.setPosition(this.fen);
        // Play audio
        const gameStartAudio = new Audio("/audio/game-start.mp3");
        gameStartAudio.play();
        if (Game.moves && Board.grid) {
            Game.moves.forEach(move => {
                const { fromRow, fromCol, toRow, toCol } = move;
                const instance = Board.grid[fromRow][fromCol];
                instance === null || instance === void 0 ? void 0 : instance.MoveableMixin.makeMove(instance, toRow, toCol);
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
    createGame() {
        // Create game wrapper
        this.gameEl.classList.add("game");
        this.createMainWrapper();
        this.createSideWrapper();
    }
    /**
     * Creates the necessary DOM structure for the main wrapper (chessboard, interface player)
     */
    createMainWrapper() {
        // Create main wrapper
        const mainWrapper = document.createElement('div');
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
    createSideWrapper() {
        // Create side wrapper
        const sideWrapper = document.createElement('div');
        sideWrapper.classList.add("side");
        const moveList = document.createElement("div");
        moveList.classList.add("list");
        sideWrapper.appendChild(moveList);
        this.gameEl.appendChild(sideWrapper);
    }
    /**
     * Switches the current player between white and black
     */
    static switchCurrentPlayer() {
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
    static getOpponent(player) {
        if (player) {
            return player === Game.players[Players.WHITE] ? Game.players[Players.BLACK] : Game.players[Players.WHITE];
        }
        return Game.currentPlayer === Game.players[Players.WHITE] ? Game.players[Players.BLACK] : Game.players[Players.WHITE];
    }
    static handleGameState() {
        var _a;
        const currentPlayerPieces = findAllPiecesFromPlayer(Board.grid, (_a = Game.currentPlayer) === null || _a === void 0 ? void 0 : _a.color);
        const opponentPlayerPieces = findAllPiecesFromPlayer(Board.grid, Game.getOpponent().color);
        const hasMovesLeft = currentPlayerPieces === null || currentPlayerPieces === void 0 ? void 0 : currentPlayerPieces.some((piece) => piece.getLegalMoves().length);
        if (hasInsufficientMaterial(currentPlayerPieces, opponentPlayerPieces)) {
            Game.state = Object.assign(Object.assign({}, Game.state), { status: GameStatus.GAME_OVER, winner: null, endType: GameEndTypes.INSUFFICIENT_MATERIAL });
            return;
        }
        // If player is not in checkmate
        if (hasMovesLeft) {
            return;
        }
        // Checkmate
        if (isInCheck(Game.currentPlayer)) {
            Game.state = Object.assign(Object.assign({}, Game.state), { status: GameStatus.GAME_OVER, winner: Game.getOpponent(), endType: GameEndTypes.CHECKMATE });
            return;
        }
        Game.state = Object.assign(Object.assign({}, Game.state), { status: GameStatus.GAME_OVER, winner: null, endType: GameEndTypes.STALEMATE });
    }
}
// Default configuration for the game
Game.DEFAULT_CONFIG = {
    player: Players.WHITE,
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    pieceTheme: "classic",
    moves: [],
    whiteTime: 1200,
    blackTime: 1200,
};
export { Game };
