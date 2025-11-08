import { NextFunction, Request, Response } from 'express';

import { InvalidTransitionError, TaskNotFoundError } from '../services/task.service.js';
import { logger } from '../observability/logger.js';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof TaskNotFoundError) {
    res.status(404).json({ code: 'TASK_NOT_FOUND', message: err.message });
    return;
  }

  if (err instanceof InvalidTransitionError) {
    res
      .status(409)
      .json({ code: 'INVALID_TRANSITION', message: err.message, details: { current: err.current, next: err.next } });
    return;
  }

  logger.error({ err, requestId: req.requestId }, 'Unhandled error');
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Unexpected error' });
};
