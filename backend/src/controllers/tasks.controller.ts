import { Request, Response } from 'express';

import { CreateTaskSchema, ListTasksQuerySchema, UpdateTaskStatusSchema } from '../domain/task.js';
import { TaskService } from '../services/task.service.js';

export class TasksController {
  constructor(private readonly service: TaskService) {}

  createTask = async (req: Request, res: Response): Promise<void> => {
    const parseResult = CreateTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ code: 'INVALID_PAYLOAD', message: 'Invalid payload', details: parseResult.error.errors });
      return;
    }

    const task = await this.service.createTask(parseResult.data);
    res.status(201).json(task);
  };

  listTasks = async (req: Request, res: Response): Promise<void> => {
    const parseResult = ListTasksQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      res.status(400).json({ code: 'INVALID_QUERY', message: 'Invalid query parameters', details: parseResult.error.errors });
      return;
    }

    const response = await this.service.listTasks({
      status: parseResult.data.status,
      q: parseResult.data.q,
      limit: parseResult.data.limit,
      offset: parseResult.data.offset
    });

    res.json(response);
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const parseResult = UpdateTaskStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ code: 'INVALID_PAYLOAD', message: 'Invalid payload', details: parseResult.error.errors });
      return;
    }

    const task = await this.service.updateStatus(req.params.id, parseResult.data);
    res.json(task);
  };
}
