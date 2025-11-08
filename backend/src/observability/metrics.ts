import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

client.collectDefaultMetrics();

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const end = httpRequestDurationSeconds.startTimer({ method: req.method });
  res.on('finish', () => {
    end({ route: req.route?.path ?? req.path, status_code: res.statusCode });
  });
  next();
};

export const metricsRegistry = client.register;
