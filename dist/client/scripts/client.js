import { Game } from "./Chess/game/Game.js";
class Client {
    constructor() {
        this.timerInterval = null;
        this.socket = io();
        this.socket.on("isInQueue", () => this.handleQueue());
        this.socket.on("joinMatch", (roomName) => this.handleJoinMatch(roomName));
        this.socket.on("startMatch", (options) => this.handleStartMatch(options));
        this.socket.on("sendToHome", () => this.handleSendToHome());
        this.socket.on("disconnectNotification", (disconnectTime) => this.handleDisconnectNotification(disconnectTime));
        this.socket.on("cleanup", () => this.handleCleanup());
        this.socket.on("setCookie", (cookieData) => this.handleSetCookie(cookieData));
    }
    /**
     * Creates a modal container and returns the text element for the queue modal.
     * @return The created text element for the queue modal.
     */
    createModal(containerClass, iconSymbol) {
        // Create a modal container element
        const modal = document.createElement("aside");
        modal.classList.add(containerClass);
        // Create a wrapper for content
        const contentWrapper = document.createElement("div");
        // Create an icon element
        const icon = document.createElement("span");
        icon.textContent = iconSymbol;
        icon.classList.add("material-symbols-outlined");
        // Create a text element
        const text = document.createElement("p");
        // Append icon and text to content wrapper
        contentWrapper.appendChild(icon);
        contentWrapper.appendChild(text);
        // Append content wrapper and modal to the document body
        modal.appendChild(contentWrapper);
        document.body.appendChild(modal);
        return text;
    }
    /**
     * Creates and returns the text element for the queue modal.
     * @return The created text element for the queue modal.
     */
    createQueueModal() {
        // Create and return a queue modal
        return this.createModal("queue-modal", "search");
    }
    /**
     * Creates and returns the text element for the disconnect modal.
     * @return The created text element for the disconnect modal.
     */
    createDisconnectModal() {
        // Create and return a disconnect modal
        return this.createModal("disconnect-modal", "wifi_off");
    }
    /**
     * Handles entering the queue and updates the queue modal text with waiting time.
     */
    handleQueue() {
        // Handle entering the queue
        const queueModal = this.createQueueModal();
        let timer = 0;
        const updateTimer = () => {
            // Update queue modal text with waiting time
            queueModal.textContent = `You are in queue. Waiting time: ${timer++} seconds.`;
        };
        // Initial update before starting the interval
        updateTimer();
        // Update the timer every second
        this.timerInterval = setInterval(updateTimer, 1000);
    }
    /**
     * Handles joining a match by redirecting to the specified room.
     */
    handleJoinMatch(roomName) {
        // Redirect to the specified room
        window.location.href = `room/${roomName}`;
    }
    /**
     * Handles redirecting to the home page.
     */
    handleSendToHome() {
        // Redirect to the home page
        window.location.href = "/";
    }
    /**
     * Handles starting a match with the given options.
     */
    handleStartMatch(options) {
        // Handle starting a match with the given options
        const config = {
            player: options.color,
            moves: options.moves,
            whiteTime: options.whiteTime,
            blackTime: options.blackTime,
        };
        // Create and start a new game
        const game = new Game(config);
        game.start();
    }
    /**
     * Handles the notification for opponent disconnection.
     */
    handleDisconnectNotification(disconnectTime) {
        // Handle opponent disconnection notification
        const disconnectModal = this.createDisconnectModal();
        let remainingTime = disconnectTime / 1000;
        const updateTimer = () => {
            // Update disconnect modal text with remaining reconnection time
            disconnectModal.textContent =
                remainingTime >= 0
                    ? `Opponent disconnected, they have ${remainingTime--} seconds to reconnect.`
                    : `Opponent disconnected from the game.`;
            // Clear the interval when the time runs out
            if (remainingTime < 0) {
                clearInterval(this.timerInterval);
            }
        };
        // Initial update before starting the interval
        updateTimer();
        // Update the timer every second
        this.timerInterval = setInterval(updateTimer, 1000);
    }
    /**
     * Updates the disconnect modal to indicate reconnection.
     */
    updateModalForReconnection(modal, iconSymbol, textContent) {
        // Update a modal to indicate reconnection
        modal.classList.add("reconnected");
        // Update modal text
        const modalText = modal.querySelector("p");
        const modalIcon = modal.querySelector("span");
        if (modalText && modalIcon) {
            modalText.textContent = textContent;
            modalIcon.textContent = iconSymbol;
        }
    }
    /**
     * Hides and removes the modal after a delay.
     */
    hideAndRemoveModal(modal) {
        // Set delay values for hiding and removing modals
        const HIDE_DELAY = 3000;
        const REMOVE_DELAY = 300;
        // Hide the modal after a delay
        setTimeout(() => {
            modal.classList.add("hide");
            // Remove the modal after another delay
            setTimeout(() => {
                modal.remove();
            }, REMOVE_DELAY);
        }, HIDE_DELAY);
    }
    /**
     * Updates the disconnect modal for reconnection.
     */
    updateDisconnectModalForReconnection(disconnectModal) {
        // Update disconnect modal for reconnection
        this.updateModalForReconnection(disconnectModal, "wifi", "Opponent reconnected to the game.");
    }
    /**
     * Performs cleanup tasks, such as clearing intervals and handling disconnect modals.
     */
    handleCleanup() {
        // Perform cleanup tasks
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        // Find the disconnect modal in the document
        const disconnectModal = document.querySelector("aside.disconnect-modal");
        // If the disconnect modal exists, update and hide/remove it
        if (disconnectModal) {
            // Update the disconnect modal for potential reconnection
            this.updateDisconnectModalForReconnection(disconnectModal);
            // Hide and remove the disconnect modal from the document
            this.hideAndRemoveModal(disconnectModal);
        }
    }
    /**
     * Sets a cookie with the provided data.
     */
    handleSetCookie(cookieData) {
        var _a, _b, _c;
        // Handle setting a cookie with the provided data
        const domain = ((_a = cookieData.options) === null || _a === void 0 ? void 0 : _a.domain) || "";
        const path = ((_b = cookieData.options) === null || _b === void 0 ? void 0 : _b.path) || "/";
        const secure = ((_c = cookieData.options) === null || _c === void 0 ? void 0 : _c.secure) || false;
        // Set cookie expiration date to one month from now
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        // Set the cookie with the provided data
        document.cookie = `${cookieData.name}=${cookieData.value}; domain=${domain}; path=${path}; secure=${secure}; expires=${expirationDate.toUTCString()}`;
    }
}
// Create an instance of the Client class
const client = new Client();
export default client;
