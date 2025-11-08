import { randomUUID } from 'node:crypto';

import { Request, Response, NextFunction } from 'express';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = req.headers['x-request-id']?.toString() ?? randomUUID();
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
};
