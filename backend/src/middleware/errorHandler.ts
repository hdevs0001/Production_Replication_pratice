// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import { logger } from '../utils/logger';
import { AppError } from '../utils/error';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : 'Something went wrong';

  logger.error('request failed', {
    requestId: (req as any).requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: message,
    stack: err instanceof Error ? err.stack : undefined,
  });

  // Only report genuine server errors (5xx) to Sentry — a 404 for a
  // missing task isn't a "bug," it's expected behavior, so don't
  // pollute Sentry's issue list with those.
  if (statusCode >= 500) {
    Sentry.captureException(err);
  }

  res.status(statusCode).json({
    error: message,
  });
}