import { getMergedMoveArray } from "../../misc/getMergedMoveArray.js";
import { DEFAULT_TRANSLATE, translate } from "../../misc/translate.js";
import { CastlingType } from "../../enums/Castling.js";
import { Board } from "../Board.js";
import { Game } from "../Game.js";
/**
 * Mixin used for all revertable aspects of the board
 */
const RevertableMixin = {
    /**
     * Reverts the board state to a specific move index
     */
    revertBoardState(moveIndex) {
        console.log(`Before reverting`);
        console.log(Board.grid);
        // Determine the direction of reverting based on the current index and target move index
        const isBackwards = Board.currentIndex > moveIndex;
        // Update movement properties based on the target move index
        this.handleMovementProperties(moveIndex);
        // Get the array of merged moves
        const madeMoves = getMergedMoveArray();
        // Check if current move allows further movements
        Game.allowMovements = moveIndex === madeMoves.length;
        // Determine the start and end index for the loop based on the direction of reverting
        const startIndex = isBackwards ? Board.currentIndex - 1 : Board.currentIndex;
        const endIndex = isBackwards ? moveIndex : moveIndex - 1;
        // Iterate through the moves and revert each move individually
        for (let i = startIndex; isBackwards ? i >= endIndex : i <= endIndex; isBackwards ? i-- : i++) {
            const move = madeMoves[i];
            this.revertSingleMove(move, isBackwards, i === endIndex);
        }
        // Set the new highlighted tile or remove existing highlights
        moveIndex > 0 ? Board.highlightMovePositions(madeMoves[moveIndex - 1]) : document.querySelectorAll(".highlighted").forEach((highlightedTile) => highlightedTile.classList.remove("highlighted"));
        // Update the current index to the target move index
        Board.currentIndex = moveIndex;
        console.log(`After reverting:`);
        console.log(Board.grid);
    },
    /**
    * Reverts a single move on the board
    */
    revertSingleMove(move, isBackwards, isLastMove) {
        var _a, _b;
        // Determine the destination row and column based on the direction of reverting
        const [moveToRow, moveToCol] = isBackwards ? [move.fromRow, move.fromCol] : [move.toRow, move.toCol];
        const castleCol = move.specialMove === CastlingType.SHORT ? (isBackwards ? 7 : 5) : (isBackwards ? 0 : 3);
        // Show captured move
        if (move.capture) {
            move.capture.pieceDomEl.classList.toggle("captured", !isBackwards);
        }
        // If it is not the last reverted move, skip all animations to avoid duplication glitches
        if (!isLastMove) {
            move.piece.MoveableMixin.updatePiecePosition(move.piece, moveToRow, moveToCol);
            if ((_a = move.castledPiece) === null || _a === void 0 ? void 0 : _a.pieceDomEl) {
                move.castledPiece.MoveableMixin.updatePiecePosition(move.castledPiece, move.castledPiece.row, castleCol);
            }
            return;
        }
        // Calculate the differences for translation based on the direction of reverting
        const colDiff = (move.toCol - move.fromCol) * 100 * (isBackwards ? -1 : 1);
        const rowDiff = (move.toRow - move.fromRow) * 100 * (isBackwards ? -1 : 1);
        // Translate the piece to its original position
        translate(move.piece.pieceDomEl, rowDiff, colDiff);
        // If castling occurred, translate the castled piece aswell
        if ((_b = move.castledPiece) === null || _b === void 0 ? void 0 : _b.pieceDomEl) {
            const castleColDiff = (isBackwards ? (move.castledPiece.col - castleCol) : (castleCol - move.castledPiece.col)) * 100 * (isBackwards ? -1 : 1);
            translate(move.castledPiece.pieceDomEl, 0, castleColDiff);
        }
        // Play the correct audio
        if (move.check) {
            const checkAudio = new Audio("/audio/check.mp3");
            checkAudio.play();
        }
        else if (move.capture) {
            const captureAudio = new Audio("/audio/capture.mp3");
            captureAudio.play();
        }
        else if (move.specialMove && move.castledPiece) {
            const castleAudio = new Audio("/audio/castle.mp3");
            castleAudio.play();
        }
        else {
            const moveAudio = new Audio("/audio/move.mp3");
            moveAudio.play();
        }
        // Asynchronously revert the move after a delay to simulate the original move speed
        setTimeout(() => {
            var _a;
            translate(move.piece.pieceDomEl, DEFAULT_TRANSLATE, DEFAULT_TRANSLATE);
            move.piece.MoveableMixin.updatePiecePosition(move.piece, moveToRow, moveToCol);
            // If castling occurred, translate the castled piece back to its original position
            if ((_a = move.castledPiece) === null || _a === void 0 ? void 0 : _a.pieceDomEl) {
                translate(move.castledPiece.pieceDomEl, DEFAULT_TRANSLATE, DEFAULT_TRANSLATE);
                move.castledPiece.MoveableMixin.updatePiecePosition(move.castledPiece, move.castledPiece.row, castleCol);
            }
        }, Game.moveSpeed);
    },
    /**
     * Handles the visual properties related to movement
     */
    handleMovementProperties(moveIndex) {
        // Remove the selected class from all move elements
        document.querySelectorAll(".turn > span").forEach((spanEl) => {
            spanEl.classList.remove("selected");
        });
        // Remove marked tile
        document.querySelectorAll(".marked").forEach((markedTile) => {
            markedTile.classList.remove("marked");
        });
        // Highlight the selected move element
        const selectedMoveElement = document.querySelector(`span[data-move="${moveIndex}"]`);
        selectedMoveElement === null || selectedMoveElement === void 0 ? void 0 : selectedMoveElement.classList.add("selected");
    },
};
export { RevertableMixin };
