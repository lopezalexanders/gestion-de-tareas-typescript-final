import { CreateTaskInput, Task, TaskStatus, UpdateTaskStatusInput, isTransitionAllowed } from '../domain/task.js';
import { ListTasksFilters, TaskRepository } from '../repositories/types.js';

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  async createTask(data: CreateTaskInput): Promise<Task> {
    return this.repository.createTask({ ...data, status: data.status ?? 'pending' });
  }

  async listTasks(filters: ListTasksFilters): Promise<{ items: Task[]; total: number }> {
    return this.repository.listTasks(filters);
  }

  async updateStatus(id: string, payload: UpdateTaskStatusInput): Promise<Task> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new TaskNotFoundError(id);
    }

    if (!isTransitionAllowed(existing.status, payload.status)) {
      throw new InvalidTransitionError(existing.status, payload.status);
    }

    const updated = await this.repository.updateStatus(id, payload.status);
    if (!updated) {
      throw new TaskNotFoundError(id);
    }
    return updated;
  }
}

export class TaskNotFoundError extends Error {
  constructor(public readonly taskId: string) {
    super(`Task with id ${taskId} was not found`);
    this.name = 'TaskNotFoundError';
  }
}

export class InvalidTransitionError extends Error {
  constructor(public readonly current: TaskStatus, public readonly next: TaskStatus) {
    super(`Cannot transition task from ${current} to ${next}`);
    this.name = 'InvalidTransitionError';
  }
}
