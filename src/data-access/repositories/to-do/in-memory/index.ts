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
    if (!todoList) {
      return [];
    }

    const parsedPayload = JSON.parse(todoList);

    if (!Array.isArray(parsedPayload)) {
      throw new Error('Cache has a fatal defect. To-dos entry is not an array');
    }

    return parsedPayload.map((t: JSONTodoData) => new ConcreteTodo(t));
  }

  async listByOwnerId(ownerId: string): Promise<Todo[]> {
    if (!ownerId)
      throw new Error('Failed to list all to-dos by owner id. Invalid owner identifier');

    const serializedPayload = await this.inMemoryCache.get(TO_DO_KEY);
    if (!serializedPayload) return [];

    const payload = JSON.parse(serializedPayload);
    if (!Array.isArray(payload))
      throw new Error('Cache has a fatal defect. To-dos entry is not an array');

    const todoListOfOwner = payload.filter((t: JSONTodoData) => t.ownerId === ownerId);
    return todoListOfOwner.map((t: JSONTodoData) => new ConcreteTodo(t));
  }

  getById(id: string): Promise<Todo> {
    throw new Error('Method not implemented.');
  }

  create({ title, ownerId }: { title: string; ownerId: string }): Promise<Todo> {
    throw new Error('Method not implemented.');
  }
}
