interface ControlsProps {
    isActive: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onSkip: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
    isActive,
    onStart,
    onPause,
    onReset,
    onSkip
}) => {
    return (
        <div className="controls">
            {isActive ? (
                <button className="btn btn-pause" onClick={onPause}>
                    ⏸️ Pause
                </button>
            ) : (
                <button className="btn btn-start" onClick={onStart}>
                    ▶️ Start
                </button>
            )}
            <button className="btn btn-reset" onClick={onReset}>
                🔄 Reset
            </button>
            <button className="btn btn-skip" onClick={onSkip}>
                ⏭️ Skip
            </button>
        </div>
    );
};
