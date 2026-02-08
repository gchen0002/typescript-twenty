import { useState } from 'react';

interface TaskInputProps {
    onAddTask: (title: string) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (inputValue.trim()) {
            onAddTask(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <form className="task-input-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What are you working on?"
                className="task-input"
            />
            <button type="submit" className="btn btn-add">
                Add Task
            </button>
        </form>
    );
};
