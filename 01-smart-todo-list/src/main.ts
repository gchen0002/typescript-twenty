import './style.css';
import type { Task, Priority } from './types';

// lower number = higher priority
const priorityWeight = {
  high: 1,
  medium: 2,
  low: 3,
}
// State
let tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter: 'all' | 'active' | 'completed' | 'timed' | 'untimed' = 'all';

// DOM Elements (declared, assigned after DOM loads)
let taskInput: HTMLInputElement;
let prioritySelect: HTMLSelectElement;
let addBtn: HTMLButtonElement;
let taskList: HTMLUListElement;
let filterBtns: NodeListOf<Element>;
let dueDateInput: HTMLInputElement;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Assign DOM Elements
  taskInput = document.getElementById('taskInput') as HTMLInputElement;
  prioritySelect = document.getElementById('prioritySelect') as HTMLSelectElement;
  addBtn = document.getElementById('addBtn') as HTMLButtonElement;
  taskList = document.getElementById('taskList') as HTMLUListElement;
  filterBtns = document.querySelectorAll('.filter-btn');
  dueDateInput = document.getElementById('dueDateInput') as HTMLInputElement;

  // Initial Render
  renderTasks();

  // Event Listeners
  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.target as HTMLButtonElement;
      setFilter(target.dataset.filter as any);
    });
  });
});

// Functions
function addTask() {
  const title = taskInput.value.trim();
  if (!title) return;

  const newTask: Task = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    priority: prioritySelect.value as Priority,
    dueDate: dueDateInput.value || undefined,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = '';
  dueDateInput.value = '';
  taskInput.focus();
}

function toggleTask(id: string) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id: string) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function setFilter(filter: 'all' | 'active' | 'completed') {
  currentFilter = filter;

  // Update UI
  filterBtns.forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
  activeBtn?.classList.add('active');

  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    if (currentFilter === 'timed') return !!task.dueDate;
    if (currentFilter === 'untimed') return !task.dueDate;
    return true;
  });

  filteredTasks.sort((a, b) => {
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return priorityWeight[a.priority] - priorityWeight[b.priority];
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    // Title
    const span = document.createElement('span');
    span.className = 'task-title';
    span.textContent = task.title;

    // Badge
    const badge = document.createElement('span');
    badge.className = `badge priority-${task.priority}`;
    badge.textContent = task.priority;

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = 'Delete task';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Due Date
    const dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'due-date';
    dueDateSpan.textContent = task.dueDate || '';
    li.append(checkbox, span, badge, deleteBtn, dueDateSpan);
    taskList.appendChild(li);
  });
}
