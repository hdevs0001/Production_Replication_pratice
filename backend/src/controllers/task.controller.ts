// src/controllers/task.controller.ts
import { Request, Response } from 'express';
import * as taskService from '../services/task.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryParams } from '../types/task.types';

type IdParam = { id: string };

export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as TaskQueryParams;
  const result = await taskService.getTasks(query);
  res.status(200).json(result);
});

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await taskService.getStats();
  res.status(200).json(stats);
});

export const getTaskById = asyncHandler(async (req: Request<IdParam>, res: Response) => {
  const task = await taskService.getTaskById(req.params.id);
  res.status(200).json(task);
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateTaskInput;
  const task = await taskService.createTask(input);
  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req: Request<IdParam>, res: Response) => {
  const input = req.body as CreateTaskInput;
  const task = await taskService.replaceTask(req.params.id, input);
  res.status(200).json(task);
});

export const patchTask = asyncHandler(async (req: Request<IdParam>, res: Response) => {
  const input = req.body as UpdateTaskInput;
  const task = await taskService.patchTask(req.params.id, input);
  res.status(200).json(task);
});

export const deleteTask = asyncHandler(async (req: Request<IdParam>, res: Response) => {
  await taskService.deleteTask(req.params.id);
  res.status(204).send();
});