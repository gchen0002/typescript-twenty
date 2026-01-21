import { CONFIG } from "./constants";
import type { TypingStats } from "./types";

export function calculateStats(
    typedChars: (string | null)[],
    text: string,
    timeRemaining: number
): TypingStats {
    let correct = 0;
    let errors = 0;
    let totalTyped = 0;

    typedChars.forEach((typed, i) => {
        if (typed !== null) {
            totalTyped++;
            if (typed === text[i]) {
                correct++;
            } else {
                errors++;
            }
        }
    });

    const elapsedSeconds = CONFIG.INITIAL_TIME - timeRemaining;
    const elapsedMinutes = elapsedSeconds / 60 || 1 / 60;

    const wpm = (correct / CONFIG.WPM_DIVISOR) / elapsedMinutes;
    const accuracy = totalTyped > 0 ? (correct / totalTyped) * 100 : 100;

    return {
        wpm,
        accuracy,
        correctChars: correct,
        incorrectChars: errors,
        totalChars: totalTyped,
        errors,
        time: elapsedSeconds
    };
}
