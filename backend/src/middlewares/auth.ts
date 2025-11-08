import { Request, Response, NextFunction } from 'express';

export const checkAuth = (req: Request, _res: Response, next: NextFunction): void => {
  req.user = { id: 'demo-user' } as any;
  next();
};

export const checkPermissions = (_scope: string) => {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    next();
  };
};
