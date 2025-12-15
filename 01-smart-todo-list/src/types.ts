export const Priority = {
    High: 'high',
    Medium: 'medium',
    Low: 'low',
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    priority: Priority;
    dueDate?: string;
}

