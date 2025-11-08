import { describe, expect, it } from 'vitest';

import { TaskService, InvalidTransitionError, TaskNotFoundError } from '../../src/services/task.service.js';
import { TaskRepository } from '../../src/repositories/types.js';
import { TaskStatus } from '../../src/domain/task.js';

const createRepository = (overrides: Partial<TaskRepository> = {}): TaskRepository => ({
  createTask: overrides.createTask as any,
  listTasks: overrides.listTasks as any,
  findById: overrides.findById as any,
  updateStatus: overrides.updateStatus as any
});

describe('TaskService', () => {
  it('creates task with default status', async () => {
    const repository = createRepository({
      createTask: async (data) => ({
        id: '1',
        title: data.title,
        description: data.description ?? null,
        status: data.status ?? 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    });

    const service = new TaskService(repository);
    const task = await service.createTask({ title: 'Test task' });
    expect(task.status).toBe('pending');
  });

  it('throws error when task not found', async () => {
    const repository = createRepository({
      findById: async () => null,
      updateStatus: async () => null
    });
    const service = new TaskService(repository);

    await expect(() => service.updateStatus('missing', { status: 'done' })).rejects.toBeInstanceOf(TaskNotFoundError);
  });

  it('validates transitions', async () => {
    const repository = createRepository({
      findById: async () => ({
        id: '1',
        title: 'Task',
        description: null,
        status: 'done' as TaskStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }),
      updateStatus: async () => null
    });

    const service = new TaskService(repository);

    await expect(() => service.updateStatus('1', { status: 'pending' as TaskStatus })).rejects.toBeInstanceOf(
      InvalidTransitionError
    );
  });
});
