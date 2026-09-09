// src/services/task.service.ts
import * as taskModel from "../models/task.model";
import { NotFoundError, ValidationError } from "../utils/error";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryParams,
  TaskStats,
  PaginatedTasksResponse,
} from "../types/task.types";

export async function getTasks(
  query: TaskQueryParams,
): Promise<PaginatedTasksResponse> {
  return taskModel.findAll(query);
}

export async function getTaskById(id: string): Promise<Task> {
  const task = await taskModel.findById(id);
  if (!task) {
    throw new NotFoundError(`Task with id ${id} not found`);
  }
  return task;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  if (!input.title || input.title.trim().length === 0) {
    throw new ValidationError("Title is required");
  }

  return taskModel.create({
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
  });
}

export async function replaceTask(
  id: string,
  input: CreateTaskInput,
): Promise<Task> {
  if (!input.title || input.title.trim().length === 0) {
    throw new ValidationError("Title is required");
  }

  const existing = await taskModel.findById(id);
  if (!existing) {
    throw new NotFoundError(`Task with id ${id} not found`);
  }

  const updated = await taskModel.update(id, {
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    completed: false,
  });

  return updated as Task;
}

export async function patchTask(
  id: string,
  input: UpdateTaskInput,
): Promise<Task> {
  if (input.title !== undefined && input.title.trim().length === 0) {
    throw new ValidationError("Title cannot be empty");
  }

  const existing = await taskModel.findById(id);
  if (!existing) {
    throw new NotFoundError(`Task with id ${id} not found`);
  }

  const updated = await taskModel.update(id, input);
  return updated as Task;
}

export async function deleteTask(id: string): Promise<void> {
  const deleted = await taskModel.remove(id);
  if (!deleted) {
    throw new NotFoundError(`Task with id ${id} not found`);
  }
}

export async function getStats(): Promise<TaskStats> {
  return taskModel.getStats();
}
