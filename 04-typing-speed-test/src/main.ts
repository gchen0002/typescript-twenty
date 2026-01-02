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

async function fetchRandomQuote(): Promise<string> {
    try {
        const response = await fetch(
            'https://motivational-spark-api.vercel.app/api/quotes/random'
        );
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        // Returns {author: "...", quote: "..."}
        return data.quote;
    } catch {
        // Fallback to hardcoded texts
        return getRandomText();
    }
}

function createInitialState(text: string): GameStats {
    return {
        status: "idle",
        currentIndex: 0,
        startTime: null,
        timeRemaining: CONFIG.INITIAL_TIME,
        text,
        stats: {
            wpm: 0,
            accuracy: 100,
            correctChars: 0,
            incorrectChars: 0,
            totalChars: 0,
            errors: 0,
            time: 0
        },
        typedChars: new Array(text.length).fill(null)
    }
}

// initialize the game state
let gameState = createInitialState(getRandomText());
let timerInterval: number | null = null;

function renderText() {
    const text = gameState.text;
    const currentIndex = gameState.currentIndex;
    const textDisplay = document.getElementById("text-display")!;
    textDisplay.innerHTML = "";
    let textFragment = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const typedChar = gameState.typedChars[i];
        
        let charStatus: CharacterStatus = "pending";
        if (i === currentIndex) {
            charStatus = "current";
        } else if (typedChar !== null) {
            charStatus = typedChar === char ? "correct" : "incorrect";
        }
        
        textFragment += `<span class="char ${charStatus}">${char}</span>`;
    }
    textDisplay.innerHTML = textFragment;
}

function updateStats(): void {
    const stats = gameState.stats;
    wpmDisplay.textContent = stats.wpm.toFixed(2);
    accuracyDisplay.textContent = stats.accuracy.toFixed(2) + "%";
    errorsDisplay.textContent = stats.errors.toString();
    
    // Update results modal stats
    finalWpm.textContent = stats.wpm.toFixed(0);
    finalAccuracy.textContent = stats.accuracy.toFixed(1) + "%";
    finalErrors.textContent = stats.errors.toString();
    finalChars.textContent = stats.totalChars.toString();
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

function recalculateStats(): void {
    let correct = 0;
    let errors = 0;
    let totalTyped = 0;
    
    gameState.typedChars.forEach((typed, i) => {
        if (typed !== null) {
            totalTyped++;
            if (typed === gameState.text[i]) {
                correct++;
            } else {
                errors++;
            }
        }
    });

    gameState.stats.correctChars = correct;
    gameState.stats.errors = errors;
    gameState.stats.totalChars = totalTyped;

    const elapsedSeconds = CONFIG.INITIAL_TIME - gameState.timeRemaining;
    const elapsedMinutes = elapsedSeconds / 60 || 1 / 60;
    
    // WPM: (correct characters / 5) / elapsed minutes
    gameState.stats.wpm = (correct / CONFIG.WPM_DIVISOR) / elapsedMinutes;
    gameState.stats.accuracy = totalTyped > 0 ? (correct / totalTyped) * 100 : 100;
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
        startTimer();
    }

    const char = value[value.length - 1];
    if (gameState.currentIndex < gameState.text.length) {
        gameState.typedChars[gameState.currentIndex] = char;
        gameState.currentIndex++;
    }

    input.value = "";
    recalculateStats();
    updateStats();
    renderText();

    if (gameState.currentIndex >= gameState.text.length) {
        endGame();
    }
}

function handleKeyDown(event: KeyboardEvent): void {
    if (gameState.status !== "running") return;

    if (event.key === "Backspace") {
        if (gameState.currentIndex > 0) {
            gameState.currentIndex--;
            gameState.typedChars[gameState.currentIndex] = null;
            recalculateStats();
            updateStats();
            renderText();
        }
    }
}

async function restartGame(): Promise<void> {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    textDisplay.innerHTML = '<span class="char pending">Loading...</span>';
    const quote = await fetchRandomQuote();
    gameState = createInitialState(quote);
    timerDisplay.textContent = gameState.timeRemaining.toString();
    renderText();
    updateStats();
    resultsModal.classList.add("hidden");
}

async function newTextGame(): Promise<void> {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    textDisplay.innerHTML = '<span class="char pending">Loading...</span>';
    const quote = await fetchRandomQuote();
    gameState = createInitialState(quote);
    timerDisplay.textContent = gameState.timeRemaining.toString();
    renderText();
    updateStats();
    resultsModal.classList.add("hidden");
}

typingInput.addEventListener('input', handleInput);
typingInput.addEventListener('keydown', handleKeyDown);
restartBtn.addEventListener('click', restartGame);
newTextBtn.addEventListener('click', newTextGame);
tryAgainBtn.addEventListener('click', restartGame);

// Initial render with API quote
(async () => {
    textDisplay.innerHTML = '<span class="char pending">Loading...</span>';
    const quote = await fetchRandomQuote();
    gameState = createInitialState(quote);
    renderText();
})();