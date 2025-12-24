import type { Card } from './types';
import { EMOJIS } from './constants';
import { shuffle } from './utils';

let cards: Card[] = [];
let flippedCards: Card[] = [];
let moves: number = 0;
let pairsFound: number = 0;
let isLocked: boolean = false;

// Initialize Game
function initGame() {
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
    // Update UI
    updateStats();
    renderBoard();
    hideWinMessage();
}

// UI Elements
const gameBoard = document.getElementById("game-board") as HTMLDivElement;
const movesDisplay = document.getElementById("moves-count") as HTMLSpanElement;
const pairsDisplay = document.getElementById("pairs-count") as HTMLSpanElement;
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;
const winMessage = document.getElementById("win-message") as HTMLDivElement;
const finalMoves = document.getElementById("final-moves") as HTMLSpanElement;
const playAgainBtn = document.getElementById("play-again-btn") as HTMLButtonElement;

// Event Listeners
resetBtn.addEventListener("click", initGame);
playAgainBtn.addEventListener("click", initGame);

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
        `
        cardElement.addEventListener("click", () => handleCardClick(card));
        gameBoard.appendChild(cardElement);
    })
}

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

// Helper functions
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

function updateStats(): void {
    movesDisplay.textContent = moves.toString();
    pairsDisplay.textContent = `${pairsFound} / 8`;
}

function showWinMessage(): void {
    winMessage.classList.remove("hidden");
    finalMoves.textContent = moves.toString();
}

function hideWinMessage(): void {
    winMessage.classList.add("hidden");
}

// Initial Kickoff
initGame();
