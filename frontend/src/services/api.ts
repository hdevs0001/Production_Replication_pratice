// src/services/api.ts
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryParams,
  TaskStats,
  PaginatedTasksResponse,
} from '../types/task.types';

// In dev, requests go through Vite's proxy (relative /api works).
// In production, VITE_API_BASE_URL points directly at the deployed backend.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response body wasn't JSON — keep the default message
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export async function getTasks(
  query: TaskQueryParams = {}
): Promise<PaginatedTasksResponse> {
  const params = new URLSearchParams(
    Object.entries(query).filter(([, v]) => v !== undefined) as [string, string][]
  );
  const res = await fetch(`${BASE_URL}/api/tasks?${params.toString()}`);
  return handleResponse<PaginatedTasksResponse>(res);
}

export async function getTaskById(id: string): Promise<Task> {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`);
  return handleResponse<Task>(res);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(res);
}

export async function updateTask(id: string, input: CreateTaskInput): Promise<Task> {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(res);
}

export async function patchTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(res);
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(res);
}

export async function getStats(): Promise<TaskStats> {
  const res = await fetch(`${BASE_URL}/api/tasks/stats`);
  return handleResponse<TaskStats>(res);
}