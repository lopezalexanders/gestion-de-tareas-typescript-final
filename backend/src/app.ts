import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json } from 'express';

import { requestIdMiddleware } from './observability/request-id.js';
import { metricsMiddleware, metricsRegistry } from './observability/metrics.js';
import { tasksRouter } from './routes/tasks.routes.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = express();

app.use(requestIdMiddleware);
app.use(metricsMiddleware);
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
app.use(json({ limit: '1mb' }));
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 100
  })
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/metrics', async (_req, res) => {
  res.setHeader('Content-Type', metricsRegistry.contentType);
  res.send(await metricsRegistry.metrics());
});

app.use('/tasks', tasksRouter);

app.use(errorHandler);

export default app;
