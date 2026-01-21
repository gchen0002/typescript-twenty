import "./style.css";
import { CONFIG } from "./constants";
import { fetchRandomQuote } from "./utils";
import { GameState } from "./GameState";
import { Timer } from "./Timer";
import { calculateStats } from "./StatsCalculator";
import { UIController } from "./UIController";

// Initialize components
const ui = new UIController();
let gameState: GameState;
let timer: Timer;

// DOM elements for new features
const restartBtn = document.getElementById("restart-btn") as HTMLButtonElement;
const newTextBtn = document.getElementById("new-text-btn") as HTMLButtonElement;
const tryAgainBtn = document.getElementById("try-again-btn") as HTMLButtonElement;
const suddenDeathToggle = document.getElementById("sudden-death-toggle") as HTMLInputElement;
const customTextBtn = document.getElementById("custom-text-btn") as HTMLButtonElement;
const customTextModal = document.getElementById("custom-text-modal") as HTMLDivElement;
const customTextArea = document.getElementById("custom-text-area") as HTMLTextAreaElement;
const useCustomTextBtn = document.getElementById("use-custom-text-btn") as HTMLButtonElement;
const cancelCustomTextBtn = document.getElementById("cancel-custom-text-btn") as HTMLButtonElement;

function endGame(): void {
    gameState.status = "finished";
    timer.stop();
    gameState.stats = calculateStats(gameState.typedChars, gameState.text, timer.getRemaining());
    ui.updateStats(gameState.stats);
    ui.showResults();
}

function updateGameStats(): void {
    gameState.stats = calculateStats(gameState.typedChars, gameState.text, timer.getRemaining());
    ui.updateStats(gameState.stats);
}

function handleInput(event: Event): void {
    if (gameState.status === "finished") return;

    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (!value) return;

    // Start timer on first char
    if (gameState.status === "idle") {
        gameState.status = "running";
        gameState.startTime = Date.now();
        timer.start();
    }

    const char = value[value.length - 1];
    const isCorrect = gameState.typeChar(char);

    // Sudden Death: end game on first mistake
    if (gameState.suddenDeath && !isCorrect) {
        input.value = "";
        updateGameStats();
        ui.renderText(gameState);
        endGame();
        return;
    }

    input.value = "";
    updateGameStats();
    ui.renderText(gameState);

    if (gameState.isComplete()) {
        endGame();
    }
}

function handleKeyDown(event: KeyboardEvent): void {
    // Tab + Enter to restart
    if (event.key === "Tab") {
        event.preventDefault();
    }
    if (event.key === "Enter" && event.getModifierState("Tab") === false) {
        // Check if Tab was recently pressed
    }

    if (gameState.status !== "running") return;

    if (event.key === "Backspace") {
        gameState.backspace();
        updateGameStats();
        ui.renderText(gameState);
    }
}

// Global shortcut: Tab + Enter to restart
let tabPressed = false;
document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
        e.preventDefault();
        tabPressed = true;
    }
    if (e.key === "Enter" && tabPressed) {
        e.preventDefault();
        restartGame();
    }
});
document.addEventListener("keyup", (e) => {
    if (e.key === "Tab") {
        tabPressed = false;
    }
});

async function restartGame(): Promise<void> {
    timer.stop();
    ui.showLoading();
    const quote = await fetchRandomQuote();
    initGame(quote);
}

async function newTextGame(): Promise<void> {
    timer.stop();
    ui.showLoading();
    const quote = await fetchRandomQuote();
    initGame(quote);
}

function initGame(text: string): void {
    gameState = new GameState(text);
    
    // Sync sudden death toggle
    if (suddenDeathToggle) {
        gameState.suddenDeath = suddenDeathToggle.checked;
    }

    timer = new Timer(
        CONFIG.INITIAL_TIME,
        (remaining) => ui.updateTimer(remaining),
        () => endGame()
    );

    ui.updateTimer(CONFIG.INITIAL_TIME);
    ui.renderText(gameState);
    ui.updateStats(gameState.stats);
    ui.hideResults();
    ui.clearInput();
}

// Custom text modal handlers
function openCustomTextModal(): void {
    if (customTextModal) {
        customTextModal.classList.remove("hidden");
        customTextArea.value = "";
        customTextArea.focus();
    }
}

function closeCustomTextModal(): void {
    if (customTextModal) {
        customTextModal.classList.add("hidden");
    }
}

function useCustomText(): void {
    const text = customTextArea.value.trim();
    if (text.length > 0) {
        timer.stop();
        initGame(text);
        closeCustomTextModal();
    }
}

// Event listeners
ui.typingInput.addEventListener("input", handleInput);
ui.typingInput.addEventListener("keydown", handleKeyDown);
restartBtn.addEventListener("click", restartGame);
newTextBtn.addEventListener("click", newTextGame);
tryAgainBtn.addEventListener("click", restartGame);

if (suddenDeathToggle) {
    suddenDeathToggle.addEventListener("change", () => {
        gameState.suddenDeath = suddenDeathToggle.checked;
    });
}

if (customTextBtn) {
    customTextBtn.addEventListener("click", openCustomTextModal);
}
if (useCustomTextBtn) {
    useCustomTextBtn.addEventListener("click", useCustomText);
}
if (cancelCustomTextBtn) {
    cancelCustomTextBtn.addEventListener("click", closeCustomTextModal);
}

// Initial load
(async () => {
    ui.showLoading();
    const quote = await fetchRandomQuote();
    initGame(quote);
})();