import "./style.css";
import { CONFIG, SAMPLE_TEXTS } from "./constants";
import type { GameStats, GameStatus, TypingStats, CharacterStatus } from "./types";

const textDisplay = document.getElementById("text-display")!;
const typingInput = document.getElementById("typing-input") as HTMLInputElement;
const restartBtn = document.getElementById("restart-btn") as HTMLButtonElement;
const newTextBtn = document.getElementById("new-text-btn") as HTMLButtonElement;
const resultsModal = document.getElementById("results-modal") as HTMLDivElement;
const timerDisplay = document.getElementById("timer-display") as HTMLSpanElement;
const wpmDisplay = document.getElementById("wpm-display") as HTMLSpanElement;
const accuracyDisplay = document.getElementById("accuracy-display") as HTMLSpanElement;
const errorsDisplay = document.getElementById("errors-display") as HTMLSpanElement;
const finalWpm = document.getElementById("final-wpm") as HTMLSpanElement;
const finalAccuracy = document.getElementById("final-accuracy") as HTMLSpanElement;
const finalChars = document.getElementById("final-chars") as HTMLSpanElement;
const finalErrors = document.getElementById("final-errors") as HTMLSpanElement;
const tryAgainBtn = document.getElementById("try-again-btn") as HTMLButtonElement;

// helper functions
function getRandomText() {
    return SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
}

function createInitialState(): GameStats {
    return {
        status: "idle",
        currentIndex: 0,
        startTime: null,
        timeRemaining: CONFIG.INITIAL_TIME,
        text: getRandomText(),
        stats: {
            wpm: 0,
            accuracy: 100,
            correctChars: 0,
            incorrectChars: 0,
            totalChars: 0,
            errors: 0,
            time: 0
        }
    }
}

// initialize the game state
let gameState = createInitialState();
let timerInterval: number | null = null;

function renderText() {
    const text = gameState.text;
    const currentIndex = gameState.currentIndex;
    const textDisplay = document.getElementById("text-display")!;
    textDisplay.innerHTML = "";
    let textFragment = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charStatus = i < currentIndex ? "correct" : "pending";
        textFragment += `<span class="char ${charStatus}">${char}</span>`;
    }
    textDisplay.innerHTML = textFragment;
}

function updateStats(): void {
    const stats = gameState.stats;
    wpmDisplay.textContent = stats.wpm.toFixed(2);
    accuracyDisplay.textContent = stats.accuracy.toFixed(2) + "%";
    errorsDisplay.textContent = stats.errors.toString();
}

function startTimer(): void {
    timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        timerDisplay.textContent = gameState.timeRemaining.toString();
        if (gameState.timeRemaining === 0) {
            clearInterval(timerInterval!);
            endGame();
        }
    }, 1000);
}

function endGame(): void {
    gameState.status = "finished";
    clearInterval(timerInterval!);
    updateStats();
    resultsModal.classList.remove("hidden");
}

function handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const text = gameState.text;
    const currentIndex = gameState.currentIndex;
    
    // Don't process if game is finished or no more text
    if (gameState.status === "finished" || currentIndex >= text.length) {
        input.value = "";
        return;
    }
    
    const char = text[currentIndex];
    
    // Start the timer on first keypress
    if (gameState.status === "idle") {
        gameState.status = "running";
        gameState.startTime = Date.now();
        startTimer();
    }
    
    // Track correct/incorrect characters
    if (value === char) {
        gameState.stats.correctChars++;
    } else {
        gameState.stats.incorrectChars++;
        gameState.stats.errors++;
    }
    gameState.stats.totalChars++;
    
    // Calculate WPM and Accuracy
    const elapsedSeconds = CONFIG.INITIAL_TIME - gameState.timeRemaining;
    const elapsedMinutes = elapsedSeconds / 60 || 1 / 60; // Avoid division by zero
    gameState.stats.wpm = (gameState.stats.correctChars / 5) / elapsedMinutes;
    gameState.stats.accuracy = gameState.stats.totalChars > 0 
        ? (gameState.stats.correctChars / gameState.stats.totalChars) * 100 
        : 100;
    
    gameState.currentIndex++;
    input.value = "";
    renderText();
    updateStats();
    
    // Check if text is complete
    if (gameState.currentIndex >= text.length) {
        endGame();
    }
}

function restartGame(): void {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    gameState = createInitialState();
    timerDisplay.textContent = gameState.timeRemaining.toString();
    renderText();
    updateStats();
    resultsModal.classList.add("hidden");
}

function newTextGame(): void {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    gameState = createInitialState();
    timerDisplay.textContent = gameState.timeRemaining.toString();
    renderText();
    updateStats();
    resultsModal.classList.add("hidden");
}

typingInput.addEventListener('input', handleInput);
restartBtn.addEventListener('click', restartGame);
newTextBtn.addEventListener('click', newTextGame);
tryAgainBtn.addEventListener('click', restartGame);

// Initial render
renderText();