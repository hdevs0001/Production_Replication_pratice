import { pgTable, text, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Drizzle can infer TypeScript types directly from the schema
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;