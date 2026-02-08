import type { TimerMode } from '../types';

interface ModeSelectorProps {
    currentMode: TimerMode;
    onModeChange: (mode: TimerMode) => void;
}

const MODES: { id: TimerMode; label: string }[] = [
    { id: 'work', label: 'Work' },
    { id: 'shortBreak', label: 'Short Break' },
    { id: 'longBreak', label: 'Long Break' }
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({
    currentMode,
    onModeChange
}) => {
    return (
        <div className="mode-selector">
            {MODES.map((mode) => (
                <button
                    key={mode.id}
                    className={`mode-btn ${currentMode === mode.id ? 'active' : ''}`}
                    onClick={() => onModeChange(mode.id)}
                >
                    {mode.label}
                </button>
            ))}
        </div>
    );
};
