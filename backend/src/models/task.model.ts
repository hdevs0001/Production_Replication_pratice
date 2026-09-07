// src/models/task.model.ts
import { eq, ilike, and, asc, desc, count, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { tasks } from '../db/schema';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryParams,
  TaskStats,
  PaginatedTasksResponse,
} from '../types/task.types';

export async function findAll(query: TaskQueryParams): Promise<PaginatedTasksResponse> {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (query.completed !== undefined) {
    conditions.push(eq(tasks.completed, query.completed === 'true'));
  }
  if (query.search) {
    conditions.push(ilike(tasks.title, `%${query.search}%`));
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const sortColumn = query.sort === 'title' ? tasks.title : tasks.createdAt;
  const orderFn = query.order === 'asc' ? asc : desc;

  const rows = await db
    .select()
    .from(tasks)
    .where(whereClause)
    .orderBy(orderFn(sortColumn))
    .limit(limit)
    .offset(offset);

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(tasks)
    .where(whereClause);

  return {
    data: rows as unknown as Task[],
    total,
    page,
    limit,
  };
}

export async function findById(id: string): Promise<Task | undefined> {
  const [row] = await db.select().from(tasks).where(eq(tasks.id, id));
  return row as unknown as Task | undefined;
}

export async function create(input: CreateTaskInput): Promise<Task> {
  const [row] = await db
    .insert(tasks)
    .values({
      title: input.title,
      description: input.description ?? '',
    })
    .returning();

  return row as unknown as Task;
}

export async function update(id: string, input: UpdateTaskInput): Promise<Task | undefined> {
  const updateData: Partial<typeof tasks.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.completed !== undefined) updateData.completed = input.completed;

  const [row] = await db
    .update(tasks)
    .set(updateData)
    .where(eq(tasks.id, id))
    .returning();

  return row as unknown as Task | undefined;
}

export async function remove(id: string): Promise<boolean> {
  const result = await db
    .delete(tasks)
    .where(eq(tasks.id, id))
    .returning({ id: tasks.id });

  return result.length > 0;
}

export async function getStats(): Promise<TaskStats> {
  const [row] = await db
    .select({
      total: count(),
      completedCount: sql<number>`count(*) filter (where ${tasks.completed} = true)`,
    })
    .from(tasks);

  const total = Number(row.total);
  const completed = Number(row.completedCount);
  const incomplete = total - completed;
  const completionRate = total > 0 ? Number(((completed / total) * 100).toFixed(1)) : 0;

  return { total, completed, incomplete, completionRate };
}