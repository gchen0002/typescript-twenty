import type { CharacterStatus, TypingStats } from "./types";
import { GameState } from "./GameState";

export class UIController {
    private textDisplay: HTMLElement;
    private timerDisplay: HTMLSpanElement;
    private wpmDisplay: HTMLSpanElement;
    private accuracyDisplay: HTMLSpanElement;
    private errorsDisplay: HTMLSpanElement;
    private finalWpm: HTMLSpanElement;
    private finalAccuracy: HTMLSpanElement;
    private finalChars: HTMLSpanElement;
    private finalErrors: HTMLSpanElement;
    private resultsModal: HTMLDivElement;
    public typingInput: HTMLInputElement;

    constructor() {
        this.textDisplay = document.getElementById("text-display")!;
        this.timerDisplay = document.getElementById("timer-display") as HTMLSpanElement;
        this.wpmDisplay = document.getElementById("wpm-display") as HTMLSpanElement;
        this.accuracyDisplay = document.getElementById("accuracy-display") as HTMLSpanElement;
        this.errorsDisplay = document.getElementById("errors-display") as HTMLSpanElement;
        this.finalWpm = document.getElementById("final-wpm") as HTMLSpanElement;
        this.finalAccuracy = document.getElementById("final-accuracy") as HTMLSpanElement;
        this.finalChars = document.getElementById("final-chars") as HTMLSpanElement;
        this.finalErrors = document.getElementById("final-errors") as HTMLSpanElement;
        this.resultsModal = document.getElementById("results-modal") as HTMLDivElement;
        this.typingInput = document.getElementById("typing-input") as HTMLInputElement;
    }

    renderText(state: GameState): void {
        const text = state.text;
        const currentIndex = state.currentIndex;

        let html = "";
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const typedChar = state.typedChars[i];

            let charStatus: CharacterStatus = "pending";
            if (i === currentIndex) {
                charStatus = "current";
            } else if (typedChar !== null) {
                charStatus = typedChar === char ? "correct" : "incorrect";
            }

            html += `<span class="char ${charStatus}">${char}</span>`;
        }

        // Insert caret at currentIndex
        if (currentIndex < text.length) {
            const parts = html.split(`<span class="char current">`);
            if (parts.length > 1) {
                html = parts[0] + `<span class="caret"></span><span class="char current">` + parts.slice(1).join(`<span class="char current">`);
            }
        } else {
            html += `<span class="caret"></span>`;
        }

        this.textDisplay.innerHTML = html;
    }

    updateStats(stats: TypingStats): void {
        this.wpmDisplay.textContent = stats.wpm.toFixed(2);
        this.accuracyDisplay.textContent = stats.accuracy.toFixed(2) + "%";
        this.errorsDisplay.textContent = stats.errors.toString();

        this.finalWpm.textContent = stats.wpm.toFixed(0);
        this.finalAccuracy.textContent = stats.accuracy.toFixed(1) + "%";
        this.finalErrors.textContent = stats.errors.toString();
        this.finalChars.textContent = stats.totalChars.toString();
    }

    updateTimer(remaining: number): void {
        this.timerDisplay.textContent = remaining.toString();
    }

    showLoading(): void {
        this.textDisplay.innerHTML = '<span class="char pending">Loading...</span>';
    }

    showResults(): void {
        this.resultsModal.classList.remove("hidden");
    }

    hideResults(): void {
        this.resultsModal.classList.add("hidden");
    }

    clearInput(): void {
        this.typingInput.value = "";
    }
}
