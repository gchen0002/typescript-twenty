import { useState, useEffect, useCallback } from 'react';
import type { TimerMode, TimerState } from '../types';
import { getDurationForMode, CONFIG } from '../types';

export interface UseTimerReturn {
    state: TimerState;
    start: () => void;
    pause: () => void;
    reset: () => void;
    switchMode: (mode: TimerMode) => void;
    skip: () => void;
}

export const useTimer = (): UseTimerReturn => {
    const [state, setState] = useState<TimerState>({
        timeLeft: getDurationForMode('work'),
        isActive: false,
        mode: 'work',
        completedSessions: 0,
    });

    const start = useCallback(() => {
        setState(prev => ({ ...prev, isActive: true }));
    }, []);

    const pause = useCallback(() => {
        setState(prev => ({ ...prev, isActive: false }));
    }, []);

    const reset = useCallback(() => {
        setState(prev => ({
            ...prev,
            isActive: false,
            timeLeft: getDurationForMode(prev.mode),
            completedSessions: prev.completedSessions
        }));
    }, []);

    const switchMode = useCallback((mode: TimerMode) => {
        setState(prev => ({
            ...prev,
            mode,
            timeLeft: getDurationForMode(mode),
            isActive: false
        }));
    }, []);

    const skip = useCallback(() => {
        setState(prev => {
            if (prev.mode === 'work') {
                const isLongBreak = (prev.completedSessions + 1) % CONFIG.POMODOROS_BEFORE_LONG_BREAK === 0;
                const nextMode: TimerMode = isLongBreak ? 'longBreak' : 'shortBreak';
                return {
                    ...prev,
                    mode: nextMode,
                    timeLeft: getDurationForMode(nextMode),
                    completedSessions: prev.completedSessions + 1,
                    isActive: false,
                };
            } else {
                return {
                    ...prev,
                    mode: 'work',
                    timeLeft: getDurationForMode('work'),
                    isActive: false,
                };
            }
        });
    }, []);

    useEffect(() => {
        let interval: number | null = null;

        if (state.isActive && state.timeLeft > 0) {
            interval = window.setInterval(() => {
                setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
            }, 1000);
        } else if (state.timeLeft === 0 && state.isActive) {
            skip();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [state.isActive, state.timeLeft, skip]);

    return {
        state,
        start,
        pause,
        reset,
        switchMode,
        skip
    };
};
