import { CreateTodoRequest, UpdateTodoRequest } from '../types/todo.js';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateCreateTodo(data: any): ValidationResult {
  const errors: string[] = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push('Title is required and must be a non-empty string');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateUpdateTodo(data: any): ValidationResult {
  const errors: string[] = [];
  
  if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim() === '')) {
    errors.push('Title must be a non-empty string when provided');
  }
  
  if (data.completed !== undefined && typeof data.completed !== 'boolean') {
    errors.push('Completed must be a boolean when provided');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
