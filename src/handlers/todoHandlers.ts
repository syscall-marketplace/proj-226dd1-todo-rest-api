import { Request, Response } from 'express';
import { TodoStore } from '../store/todoStore.ts';
import { ApiResponse, Todo } from '../types/todo.ts';
import { validateCreateTodo, validateUpdateTodo } from '../utils/validation.ts';

const store = new TodoStore();

export function createTodo(req: Request, res: Response): void {
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
  const response: ApiResponse<Todo> = {
    success: true,
    data: todo,
  };
  res.status(201).json(response);
}

export function getAllTodos(_req: Request, res: Response): void {
  const todos = store.getAll();
  const response: ApiResponse<Todo[]> = {
    success: true,
    data: todos,
  };
  res.status(200).json(response);
}

export function getTodoById(req: Request, res: Response): void {
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
}

export function updateTodo(req: Request, res: Response): void {
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
  const response: ApiResponse<Todo> = {
    success: true,
    data: updated!,
  };
  res.status(200).json(response);
}

export function deleteTodo(req: Request, res: Response): void {
  const existed = store.delete(req.params.id);
  if (!existed) {
    const response: ApiResponse = {
      success: false,
      error: 'Todo not found',
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse = {
    success: true,
  };
  res.status(200).json(response);
}
