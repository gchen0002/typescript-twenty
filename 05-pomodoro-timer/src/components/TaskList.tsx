import type { Task } from '../types';

interface TaskListProps {
    tasks: Task[];
    activeTaskId: string | null;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onSelectTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    activeTaskId,
    onToggleTask,
    onDeleteTask,
    onSelectTask
}) => {
    return (
        <div className="task-list">
            <h3>Tasks</h3>
            {tasks.length === 0 ? (
                <p className="no-tasks">No tasks yet. Add one above!</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className={`task-item ${
                                task.completed ? 'completed' : ''
                            } ${activeTaskId === task.id ? 'active' : ''}`}
                            onClick={() => onSelectTask(task.id)}
                        >
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    onToggleTask(task.id);
                                }}
                            />
                            <span className="task-title">{task.title}</span>
                            <span className="task-pomodoros">
                                🍅 {task.pomodoros}
                            </span>
                            <button
                                className="btn-delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteTask(task.id);
                                }}
                            >
                                🗑️
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
