export interface Card {
    id: string;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export interface BestScore {
    moves: number;
    time: string; // in seconds
}