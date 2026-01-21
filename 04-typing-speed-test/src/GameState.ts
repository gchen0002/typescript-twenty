import { CONFIG } from "./constants";
import type { GameStatus, TypingStats } from "./types";

export class GameState {
    status: GameStatus = "idle";
    currentIndex: number = 0;
    startTime: number | null = null;
    timeRemaining: number = CONFIG.INITIAL_TIME;
    text: string;
    stats: TypingStats;
    typedChars: (string | null)[];
    suddenDeath: boolean = false;

    constructor(text: string) {
        this.text = text;
        this.typedChars = new Array(text.length).fill(null);
        this.stats = {
            wpm: 0,
            accuracy: 100,
            correctChars: 0,
            incorrectChars: 0,
            totalChars: 0,
            errors: 0,
            time: 0
        };
    }

    reset(text: string): void {
        this.status = "idle";
        this.currentIndex = 0;
        this.startTime = null;
        this.timeRemaining = CONFIG.INITIAL_TIME;
        this.text = text;
        this.typedChars = new Array(text.length).fill(null);
        this.stats = {
            wpm: 0,
            accuracy: 100,
            correctChars: 0,
            incorrectChars: 0,
            totalChars: 0,
            errors: 0,
            time: 0
        };
    }

    typeChar(char: string): boolean {
        if (this.currentIndex >= this.text.length) return false;

        const isCorrect = char === this.text[this.currentIndex];
        this.typedChars[this.currentIndex] = char;
        this.currentIndex++;
        return isCorrect;
    }

    backspace(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.typedChars[this.currentIndex] = null;
        }
    }

    isComplete(): boolean {
        return this.currentIndex >= this.text.length;
    }
}
