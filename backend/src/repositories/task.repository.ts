import { randomUUID } from 'node:crypto';

import { db } from '../infra/db.js';
import { CreateTaskInput, Task, TaskStatus } from '../domain/task.js';
import { ListTasksFilters, TaskRepository } from './types.js';

const toTask = (row: any): Task => ({
  id: row.id,
  title: row.title,
  description: row.description,
  status: row.status,
  created_at: new Date(row.created_at).toISOString(),
  updated_at: new Date(row.updated_at).toISOString()
});

export class SqliteTaskRepository implements TaskRepository {
  async createTask(data: CreateTaskInput): Promise<Task> {
    const now = new Date().toISOString();
    const id = randomUUID();

    await db('tasks').insert({
      id,
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? 'pending',
      created_at: now,
      updated_at: now
    });

    return (await this.findById(id)) as Task;
  }

  async listTasks(filters: ListTasksFilters): Promise<{ items: Task[]; total: number }> {
    const { status, q, limit = 20, offset = 0 } = filters;

    const baseQuery = db('tasks');

    if (status) {
      baseQuery.where('status', status);
    }

    if (q) {
      const query = `%${q.toLowerCase()}%`;
      baseQuery.where((builder) =>
        builder
          .whereRaw('LOWER(title) LIKE ?', [query])
          .orWhereRaw('LOWER(description) LIKE ?', [query])
      );
    }

    const totalResult = await baseQuery.clone().count<{ count: number }>('id as count').first();
    const itemsRows = await baseQuery
      .clone()
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      items: itemsRows.map(toTask),
      total: totalResult ? Number(totalResult.count) : 0
    };
  }

  async findById(id: string): Promise<Task | null> {
    const row = await db('tasks').where({ id }).first();
    if (!row) {
      return null;
    }
    return toTask(row);
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task | null> {
    const now = new Date().toISOString();
    const updated = await db('tasks')
      .where({ id })
      .update({ status, updated_at: now });

    if (!updated) {
      return null;
    }

    return (await this.findById(id)) as Task;
  }
}

export const taskRepository = new SqliteTaskRepository();
