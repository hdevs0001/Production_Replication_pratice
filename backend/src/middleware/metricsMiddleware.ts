// src/middleware/metricsMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { httpRequestDuration, httpRequestErrors } from '../utils/metrics';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const endTimer = httpRequestDuration.startTimer();

  res.on('finish', () => {
    const route = req.route ? `${req.baseUrl}${req.route.path}` : req.originalUrl;
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    endTimer(labels);

    if (res.statusCode >= 400) {
      httpRequestErrors.inc(labels);
    }
  });

  next();
}