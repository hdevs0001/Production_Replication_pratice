// src/app.ts
import express, { Application } from 'express';
import { requestLogger } from './middleware/requestLogger';
import { metricsMiddleware } from './middleware/metricsMiddleware';
import { errorHandler } from './middleware/errorHandler';
import { register } from './utils/metrics';
import taskRoutes from './routes/task.routes';
import healthRoutes from './routes/health.routes';

const app: Application = express();

app.use(express.json());
app.use(requestLogger);
app.use(metricsMiddleware);

app.use('/health', healthRoutes);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

export default app;