export class Timer {
    private interval: number | null = null;
    private onTick: (remaining: number) => void;
    private onEnd: () => void;
    private remaining: number;

    constructor(
        initialTime: number,
        onTick: (remaining: number) => void,
        onEnd: () => void
    ) {
        this.remaining = initialTime;
        this.onTick = onTick;
        this.onEnd = onEnd;
    }

    start(): void {
        if (this.interval) return;

        this.interval = window.setInterval(() => {
            this.remaining--;
            this.onTick(this.remaining);

            if (this.remaining <= 0) {
                this.stop();
                this.onEnd();
            }
        }, 1000);
    }

    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    reset(initialTime: number): void {
        this.stop();
        this.remaining = initialTime;
    }

    getRemaining(): number {
        return this.remaining;
    }
}
