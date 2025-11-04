import type { Request, Response, NextFunction } from 'express';
import type { ErrorResponse } from '@repo/types';
import { logger } from './logger.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) => {
  logger.error(err, 'Unhandled error');

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    statusCode,
    timestamp: new Date().toISOString(),
  });
};

export const notFoundHandler = (_req: Request, res: Response<ErrorResponse>) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
};

