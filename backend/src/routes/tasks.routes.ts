import { Router } from 'express';

import { TasksController } from '../controllers/tasks.controller.js';
import { TaskService } from '../services/task.service.js';
import { taskRepository } from '../repositories/task.repository.js';
import { checkAuth, checkPermissions } from '../middlewares/auth.js';

const router = Router();

const controller = new TasksController(new TaskService(taskRepository));

router.use(checkAuth);

router.post('/', checkPermissions('tasks:write'), controller.createTask);
router.get('/', checkPermissions('tasks:read'), controller.listTasks);
router.put('/:id/status', checkPermissions('tasks:write'), controller.updateStatus);

export const tasksRouter = router;
