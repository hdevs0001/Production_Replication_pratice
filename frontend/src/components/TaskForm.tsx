// src/components/TaskForm.tsx

import { useState } from 'react';
import type { FormEvent } from 'react';
import { createTask } from '../services/api';
import type { Task } from '../types/task.types';

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (title.trim().length === 0) {
      setError('Title is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const newTask = await createTask({ title: title.trim(), description: description.trim() });
      onTaskCreated(newTask);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        disabled={submitting}
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        disabled={submitting}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add task'}
      </button>
      {error && <p className="task-form-error">{error}</p>}
    </form>
  );
}