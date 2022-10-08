import * as crypto from 'crypto';

import TodoRepository from '..';
import Todo from '../../../../domain/entities/to-do';
import ConcreteTodo from '../../../../domain/entities/to-do/implementation';
import InMemoryCache from '../../../in-memory-cache';

const TO_DO_KEY = 'to-do';
type JSONTodoData = { id: string; ownerId: string; title: string };

export default class InMemoryTodoRepository implements TodoRepository {
  constructor(private readonly inMemoryCache: InMemoryCache) {}

  async list(): Promise<Todo[]> {
    const keyExists = await this.inMemoryCache.exists(TO_DO_KEY);
    if (!keyExists) return [];

    const todoList = await this.inMemoryCache.get(TO_DO_KEY);
    if (!todoList) return [];

    return this.deserializeTodoList(todoList);
  }

  async listByOwnerId(ownerId: string): Promise<Todo[]> {
    if (!ownerId)
      throw new Error('Failed to list all to-dos by owner id. Invalid owner identifier');

    const serializedPayload = await this.inMemoryCache.get(TO_DO_KEY);
    if (!serializedPayload) return [];

    const todoList = this.deserializeTodoList(serializedPayload);
    const todoListOfOwner = todoList.filter((t: Todo) => t.getOwnerId() === ownerId);
    return todoListOfOwner;
  }

  async getById(id: string): Promise<Todo | undefined> {
    if (!id) throw new Error('Failed to get to-do by id. Invalid identifier');

    const serializedTodoList = await this.inMemoryCache.get(TO_DO_KEY);
    if (!serializedTodoList) return undefined;

    const todoList = this.deserializeTodoList(serializedTodoList);
    const todo = todoList.find((t: Todo) => t.getId() === id);
    return todo;
  }

  async create({ title, ownerId }: { title: string; ownerId: string }): Promise<Todo> {
    if (!title) throw new Error('Failed to create to-do. Title is invalid');
    if (!ownerId) throw new Error('Failed to create to-do. OwnerId is invalid');

    const id = crypto.randomUUID();
    const todo = new ConcreteTodo({ id, title, ownerId });

    const serializedTodoList = await this.inMemoryCache.get(TO_DO_KEY);
    const todoList = serializedTodoList ? this.deserializeTodoList(serializedTodoList) : [];

    todoList.push(todo);
    await this.inMemoryCache.set(TO_DO_KEY, JSON.stringify(todoList));

    return todo;
  }

  private deserializeTodoList(serializedPayload): Array<Todo> {
    const payload = JSON.parse(serializedPayload);
    if (!Array.isArray(payload))
      throw new Error('Cache has a fatal defect. To-dos entry is not an array');

    return payload.map((t: JSONTodoData) => new ConcreteTodo(t));
  }
}
