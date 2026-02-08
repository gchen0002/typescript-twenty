import { formatTime } from '../utils/formatTime';
import type { TimerMode, TimerState } from '../types';
import { getDurationForMode } from '../types';

interface TimerProps {
    state: TimerState;
}

const getModeColor = (mode: TimerMode): string => {
    switch (mode) {
        case 'work': return '#ff6b6b';
        case 'shortBreak': return '#4ecdc4';
        case 'longBreak': return '#45b7d1';
        default: return '#ff6b6b';
    }
};

const getModeLabel = (mode: TimerMode): string => {
    switch (mode) {
        case 'work': return 'Work';
        case 'shortBreak': return 'Short Break';
        case 'longBreak': return 'Long Break';
        default: return 'Work';
    }
};

export const Timer: React.FC<TimerProps> = ({ state }) => {
    const totalDuration = getDurationForMode(state.mode);
    const progress = ((totalDuration - state.timeLeft) / totalDuration) * 100;
    const circumference = 2 * Math.PI * 90;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="timer-container">
            <div className="mode-label">{getModeLabel(state.mode)}</div>
            <div className="timer-circle">
                <svg className="progress-ring" width="200" height="200">
                    <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="8"
                    />
                    <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke={getModeColor(state.mode)}
                        strokeWidth="8"
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                            transition: 'stroke-dashoffset 1s linear'
                        }}
                    />
                </svg>
                
                <div className="time-display">
                    {formatTime(state.timeLeft)}
                </div>
            </div>
            
            <div className="sessions-count">
                Sessions completed: {state.completedSessions}
            </div>
        </div>
    );
};
