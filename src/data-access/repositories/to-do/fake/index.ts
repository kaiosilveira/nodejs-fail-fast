import TodoRepository from '..';
import toDo from '../../../../domain/entities/to-do';

export default class FakeTodoRepository implements TodoRepository {
  create({ title, ownerId }: { title: string; ownerId: string }): Promise<toDo> {
    throw new Error('Method not implemented.');
  }

  list(): Promise<toDo[]> {
    throw new Error('Method not implemented.');
  }

  listByOwnerId(ownerId: string): Promise<toDo[]> {
    throw new Error('Method not implemented.');
  }

  getById(id: string): Promise<toDo> {
    throw new Error('Method not implemented.');
  }
}
