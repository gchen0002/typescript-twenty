import { useState, useCallback, useEffect } from 'react';
import { useTimer } from './hooks/useTimer';
import { Timer } from './components/Timer';
import { Controls } from './components/Controls';
import { ModeSelector } from './components/ModeSelector';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import type { Task } from './types';
import './App.css';

function App() {
    const { state, start, pause, reset, switchMode, skip } = useTimer();
    
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

    useEffect(() => {
        if (state.mode !== 'work' && state.completedSessions > 0 && activeTaskId) {
            setTasks(prev => prev.map(task => 
                task.id === activeTaskId 
                    ? { ...task, pomodoros: task.pomodoros + 1 } 
                    : task
            ));
        }
    }, [state.mode, state.completedSessions, activeTaskId]);

    const handleAddTask = useCallback((title: string) => {
        const newTask: Task = {
            id: Date.now().toString(),
            title,
            completed: false,
            pomodoros: 0
        };
        setTasks(prev => [...prev, newTask]);
    }, []);

    const handleToggleTask = useCallback((id: string) => {
        setTasks(prev => prev.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    }, []);

    const handleDeleteTask = useCallback((id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id));
    }, []);

    const handleSelectTask = useCallback((id: string) => {
        setActiveTaskId(id);
    }, []);

    return (
        <div className="app">
            <header>
                <h1>🍅 Pomodoro Timer</h1>
                <p>Stay focused, get things done</p>
            </header>

            <main>
                <div className="timer-section">
                    <ModeSelector
                        currentMode={state.mode}
                        onModeChange={switchMode}
                    />
                    
                    <Timer state={state} />
                    
                    <Controls
                        isActive={state.isActive}
                        onStart={start}
                        onPause={pause}
                        onReset={reset}
                        onSkip={skip}
                    />
                </div>

                <div className="tasks-section">
                    <TaskInput onAddTask={handleAddTask} />
                    
                    <TaskList
                        tasks={tasks}
                        activeTaskId={activeTaskId}
                        onToggleTask={handleToggleTask}
                        onDeleteTask={handleDeleteTask}
                        onSelectTask={handleSelectTask}
                    />
                </div>
            </main>
        </div>
    );
}

export default App;
