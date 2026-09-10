// src/components/TaskItem.tsx
import { memo } from 'react';
import type { Task } from '../types/task.types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

function TaskItemComponent({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => onToggle(task.id, e.target.checked)}
      />
      <div className="task-item-content">
        <span className="task-title">{task.title}</span>
        {task.description && (
          <span className="task-description">{task.description}</span>
        )}
      </div>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}

// memo: only re-renders this item if its own props actually change
export const TaskItem = memo(TaskItemComponent);