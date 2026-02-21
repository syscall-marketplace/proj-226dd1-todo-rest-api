import crypto from 'node:crypto';
import { Todo, UpdateTodoRequest } from '../types/todo.ts';

export class TodoStore {
  private todos: Map<string, Todo> = new Map();

  create(title: string): Todo {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };
    this.todos.set(todo.id, todo);
    return todo;
  }

  getAll(): Todo[] {
    return Array.from(this.todos.values());
  }

  getById(id: string): Todo | null {
    return this.todos.get(id) ?? null;
  }

  update(id: string, updates: UpdateTodoRequest): Todo | null {
    const todo = this.todos.get(id);
    if (!todo) return null;

    if (updates.title !== undefined) {
      todo.title = updates.title;
    }
    if (updates.completed !== undefined) {
      todo.completed = updates.completed;
    }

    this.todos.set(id, todo);
    return todo;
  }

  delete(id: string): boolean {
    return this.todos.delete(id);
  }
}
