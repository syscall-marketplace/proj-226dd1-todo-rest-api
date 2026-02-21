import { Request, Response, NextFunction } from 'express';
import { TodoStore } from '../store/todoStore.ts';
import { ApiResponse, Todo } from '../types/todo.ts';
import { validateCreateTodo, validateUpdateTodo } from '../utils/validation.ts';
import { logger } from '../utils/logger.ts';

const store = new TodoStore();

export function createTodo(req: Request, res: Response, next: NextFunction): void {
  try {
    const validation = validateCreateTodo(req.body);
    if (!validation.isValid) {
      const response: ApiResponse = {
        success: false,
        error: validation.errors.join(', '),
      };
      res.status(400).json(response);
      return;
    }

    const todo = store.create(req.body.title.trim());
    logger.info(`Todo created (id: ${todo.id})`);
    const response: ApiResponse<Todo> = {
      success: true,
      data: todo,
    };
    res.status(201).json(response);
  } catch (error) {
    logger.error('Error creating todo', error instanceof Error ? error : new Error(String(error)));
    next(error);
  }
}

export function getAllTodos(_req: Request, res: Response, next: NextFunction): void {
  try {
    const todos = store.getAll();
    const response: ApiResponse<Todo[]> = {
      success: true,
      data: todos,
    };
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error listing todos', error instanceof Error ? error : new Error(String(error)));
    next(error);
  }
}

export function getTodoById(req: Request, res: Response, next: NextFunction): void {
  try {
    const todo = store.getById(req.params.id);
    if (!todo) {
      const response: ApiResponse = {
        success: false,
        error: 'Todo not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Todo> = {
      success: true,
      data: todo,
    };
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error getting todo (todoId: ${req.params.id})`, error instanceof Error ? error : new Error(String(error)));
    next(error);
  }
}

export function updateTodo(req: Request, res: Response, next: NextFunction): void {
  try {
    const validation = validateUpdateTodo(req.body);
    if (!validation.isValid) {
      const response: ApiResponse = {
        success: false,
        error: validation.errors.join(', '),
      };
      res.status(400).json(response);
      return;
    }

    const todo = store.getById(req.params.id);
    if (!todo) {
      const response: ApiResponse = {
        success: false,
        error: 'Todo not found',
      };
      res.status(404).json(response);
      return;
    }

    const updated = store.update(req.params.id, req.body);
    logger.info(`Todo updated (todoId: ${req.params.id})`);
    const response: ApiResponse<Todo> = {
      success: true,
      data: updated!,
    };
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error updating todo (todoId: ${req.params.id})`, error instanceof Error ? error : new Error(String(error)));
    next(error);
  }
}

export function deleteTodo(req: Request, res: Response, next: NextFunction): void {
  try {
    const existed = store.delete(req.params.id);
    if (!existed) {
      const response: ApiResponse = {
        success: false,
        error: 'Todo not found',
      };
      res.status(404).json(response);
      return;
    }

    logger.info(`Todo deleted (todoId: ${req.params.id})`);
    const response: ApiResponse = {
      success: true,
    };
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error deleting todo (todoId: ${req.params.id})`, error instanceof Error ? error : new Error(String(error)));
    next(error);
  }
}
