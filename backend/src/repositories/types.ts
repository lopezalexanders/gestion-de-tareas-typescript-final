import { CreateTaskInput, Task, TaskStatus } from '../domain/task.js';

export interface ListTasksFilters {
  status?: TaskStatus;
  q?: string;
  limit?: number;
  offset?: number;
}

export interface TaskRepository {
  createTask(data: CreateTaskInput): Promise<Task>;
  listTasks(filters: ListTasksFilters): Promise<{ items: Task[]; total: number }>;
  findById(id: string): Promise<Task | null>;
  updateStatus(id: string, status: TaskStatus): Promise<Task | null>;
}
