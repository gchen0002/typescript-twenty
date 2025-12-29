export type GameStatus = "idle" | "running" | "finished";

export type CharacterStatus = "pending" | "current" | "correct" | "incorrect";

export interface TypingStats {
    totalChars: number;
    correctChars: number;
    incorrectChars: number;
    errors: number;
    accuracy: number;
    wpm: number;
    time: number;
}

export interface GameStats {
    status: GameStatus;
    stats: TypingStats;
    currentIndex: number;
    startTime: number | null;
    text: string;
    timeRemaining: number;
}