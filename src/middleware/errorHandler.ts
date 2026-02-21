import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/todo.ts';
import { logger } from '../utils/logger.ts';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const context = `${req.method} ${req.path}`;
  const todoId = req.params?.id;

  const logMessage = todoId
    ? `Error in ${context} (todoId: ${todoId}): ${err.message}`
    : `Error in ${context}: ${err.message}`;

  logger.error(logMessage, err);

  const response: ApiResponse<null> = {
    success: false,
    error: 'Internal server error',
  };

  res.status(500).json(response);
}
