import { TodoRetrievalManager } from '..';
import Todo from '../../../../../domain/entities/to-do';
import ConcreteTodo from '../../../../../domain/entities/to-do/implementation';
import InMemoryCache from '../../../../in-memory-cache';

type JSONTodoData = { id: string; ownerId: string; title: string };

export default class InMemoryTodoRetrievalManager implements TodoRetrievalManager {
  constructor(private readonly inMemoryCache: InMemoryCache) {}

  async list(): Promise<Todo[]> {
    const TO_DO_KEY = 'to-do';
    const keyExists = await this.inMemoryCache.exists(TO_DO_KEY);
    if (!keyExists) return [];

    const todoList = await this.inMemoryCache.get(TO_DO_KEY);
    if (!todoList) {
      return [];
    }

    const parsedPayload = JSON.parse(todoList);

    if (!Array.isArray(parsedPayload)) {
      throw new Error('Cache has a fatal defect. To-dos entry is not an array');
    }

    return parsedPayload.map((t: JSONTodoData) => new ConcreteTodo(t));
  }

  listByOwnerId(ownerId: string): Promise<Todo[]> {
    throw new Error('Method not implemented.');
  }

  getById(id: string): Promise<Todo> {
    throw new Error('Method not implemented.');
  }
}
