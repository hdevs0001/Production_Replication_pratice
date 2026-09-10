// src/pages/HomePage.tsx
import { useState, useCallback } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getTasks, patchTask, deleteTask } from '../services/api';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { Dashboard } from '../components/Dashboard';
import type { Task } from '../types/task.types';

export function HomePage() {
  const [filter, setFilter] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const { loading, error } = useFetch(async () => {
    const result = await getTasks();
    setTasks(result.data);
    return result;
  }, []);

  // stable reference so TaskItem (wrapped in memo) doesn't re-render unnecessarily
  const handleToggle = useCallback(async (id: string, completed: boolean) => {
    const updated = await patchTask(id, { completed });
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleTaskCreated = useCallback((newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  return (
    <div className="home-page">
      <h1>Task Manager</h1>

      <Dashboard />

      <TaskForm onTaskCreated={handleTaskCreated} />

      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search tasks..."
        className="task-filter"
      />

      {loading && <p>Loading tasks...</p>}
      {error && <p className="task-list-error">{error}</p>}

      {!loading && !error && (
        <TaskList
          tasks={tasks}
          filter={filter}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}