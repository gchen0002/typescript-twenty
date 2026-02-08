export type TimerMode = "work" | "shortBreak" | "longBreak";

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    pomodoros: number;
}

export interface TimerState {
    timeLeft: number;
    isActive: boolean;
    mode: TimerMode;
    completedSessions: number;
}

export const CONFIG = {
    WORK_MINUTES: 25,
    SHORT_BREAK_MINUTES: 5,
    LONG_BREAK_MINUTES: 15,
    POMODOROS_BEFORE_LONG_BREAK: 4,
} as const;

export const getDurationForMode = (mode: TimerMode): number => {
    switch (mode) {
        case "work":
            return CONFIG.WORK_MINUTES * 60;
        case "shortBreak":
            return CONFIG.SHORT_BREAK_MINUTES * 60;
        case "longBreak":
            return CONFIG.LONG_BREAK_MINUTES * 60;
        default:
            return CONFIG.WORK_MINUTES * 60;
    }
};
