import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiResponse } from '../types/todo.ts';
import { logger } from '../utils/logger.ts';

/**
 * Request logging middleware — logs HTTP method, path, and response status.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
}

/**
 * Wraps a route handler with try-catch so unhandled errors are forwarded
 * to the Express error-handling middleware via next(error).
 */
export function wrapHandler(
  handler: (req: Request, res: Response, next: NextFunction) => void,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Global error-handling middleware.
 * Catches all errors, logs them with context (operation, todoId if applicable),
 * and returns a consistent ApiResponse<null> with success: false.
 */
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
