import type { Card, BestScore } from './types';
import { EMOJIS, BEST_SCORE_KEY } from './constants';
import { shuffle } from './utils';

// State variables
let cards: Card[] = [];
let flippedCards: Card[] = [];
let moves: number = 0;
let pairsFound: number = 0;
let isLocked: boolean = false;
let timerInterval: number | null = null;
let elapsedSeconds: number = 0;

// UI Elements
const gameBoard = document.getElementById("game-board") as HTMLDivElement;
const movesDisplay = document.getElementById("moves-count") as HTMLSpanElement;
const pairsDisplay = document.getElementById("pairs-count") as HTMLSpanElement;
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;
const winMessage = document.getElementById("win-message") as HTMLDivElement;
const finalMoves = document.getElementById("final-moves") as HTMLSpanElement;
const playAgainBtn = document.getElementById("play-again-btn") as HTMLButtonElement;
const timerDisplay = document.getElementById("timer-display") as HTMLSpanElement;
const bestTimeDisplay = document.getElementById("best-time-display") as HTMLSpanElement;

// Timer functions
function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function startTimer(): void {
    // clear any existing timer first
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    elapsedSeconds = 0;
    timerInterval = window.setInterval(() => {
        elapsedSeconds++;
        timerDisplay.textContent = formatTime(elapsedSeconds);
    }, 1000);
}

function stopTimer(): void {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Best Score functions
function getBestScore(): BestScore | null {
    const stored = localStorage.getItem(BEST_SCORE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as BestScore;
}

function saveBestScore(moves: number, time: string): boolean {
    const currentBest = getBestScore();
    if (!currentBest || moves < currentBest.moves) {
        localStorage.setItem(BEST_SCORE_KEY, JSON.stringify({ moves, time }));
        return true;
    }
    return false;
}

function displayBestScore(): void {
    const bestScore = getBestScore();
    if (bestScore) {
        bestTimeDisplay.textContent = formatTime(parseInt(bestScore.time));
    }
}

// UI Update functions
function updateStats(): void {
    movesDisplay.textContent = moves.toString();
    pairsDisplay.textContent = `${pairsFound} / 8`;
}

function updateCardElement(card: Card): void {
    const cardElement = document.querySelector(`[data-card-id="${card.id}"]`) as HTMLDivElement;
    if (card.isFlipped) {
        cardElement.classList.add("flipped");
    } else {
        cardElement.classList.remove("flipped");
    }
}

function markAsMatched(card: Card): void {
    const cardElement = document.querySelector(`[data-card-id="${card.id}"]`) as HTMLDivElement;
    cardElement.classList.add("matched");
}

function showWinMessage(): void {
    stopTimer();
    winMessage.classList.remove("hidden");
    finalMoves.textContent = moves.toString();

    // check and save best score
    const isNewBest = saveBestScore(moves, elapsedSeconds.toString());
    if (isNewBest) {
        // Could show "New Best!" message here if desired
    }
    displayBestScore();
}

function hideWinMessage(): void {
    winMessage.classList.add("hidden");
}

// Rendering
function renderBoard(): void {
    gameBoard.innerHTML = "";
    cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        cardElement.dataset.cardId = card.id;
        cardElement.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back">${card.emoji}</div>
        </div>
        `;
        cardElement.addEventListener("click", () => handleCardClick(card));
        gameBoard.appendChild(cardElement);
    });
}

// Game Logic
function handleCardClick(card: Card): void {
    // guard clauses
    if (isLocked) return;
    if (card.isFlipped) return;
    if (card.isMatched) return;
    if (flippedCards.length >= 2) return;

    // flip the card
    card.isFlipped = true;
    flippedCards.push(card);
    updateCardElement(card);

    // if two cards are flipped, check for match
    if (flippedCards.length === 2) {
        moves++;
        updateStats();
        checkForMatch();
    }
}

function checkForMatch(): void {
    const [card1, card2] = flippedCards;
    if (card1.emoji === card2.emoji) {
        card1.isMatched = true;
        card2.isMatched = true;
        pairsFound++;
        markAsMatched(card1);
        markAsMatched(card2);
        updateStats();
        if (pairsFound === 8) {
            showWinMessage();
        }
    } else {
        isLocked = true;
        setTimeout(() => {
            card1.isFlipped = false;
            card2.isFlipped = false;
            updateCardElement(card1);
            updateCardElement(card2);
            isLocked = false;
        }, 1000);
    }
    flippedCards = [];
}

// Initialize Game
function initGame(): void {
    // Create pairs
    const emojiPairs = [...EMOJIS, ...EMOJIS];
    // Shuffle
    cards = shuffle(emojiPairs).map((emoji, index) => ({
        id: index.toString(),
        emoji: emoji,
        isFlipped: false,
        isMatched: false,
    }));
    // Reset state
    flippedCards = [];
    moves = 0;
    pairsFound = 0;
    isLocked = false;

    // Reset timer
    stopTimer();
    elapsedSeconds = 0;
    timerDisplay.textContent = formatTime(elapsedSeconds);
    startTimer();

    // Update UI
    updateStats();
    renderBoard();
    hideWinMessage();
    displayBestScore();
}

// Event Listeners
resetBtn.addEventListener("click", initGame);
playAgainBtn.addEventListener("click", initGame);

// Initial Kickoff
initGame();
