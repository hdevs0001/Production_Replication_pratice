// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
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

  res.status(statusCode).json({
    error: message,
  });
}