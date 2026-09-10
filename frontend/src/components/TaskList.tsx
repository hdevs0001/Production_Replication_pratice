// src/components/TaskList.tsx
import { useMemo } from 'react';
import { TaskItem } from './TaskItem';
import type { Task } from '../types/task.types';

interface TaskListProps {
  tasks: Task[];
  filter: string;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, filter, onToggle, onDelete }: TaskListProps) {
  // only recompute filtered list when tasks or filter actually change
  const filteredTasks = useMemo(() => {
    if (!filter.trim()) return tasks;
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [tasks, filter]);

  if (filteredTasks.length === 0) {
    return <p className="task-list-empty">No tasks found.</p>;
  }

  return (
    <ul className="task-list">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}