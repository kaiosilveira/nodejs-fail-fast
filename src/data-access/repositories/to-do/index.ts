import Todo from '../../../domain/entities/to-do';

export default interface TodoRepository {
  list(): Promise<Todo[]>;
  listByOwnerId(ownerId: string): Promise<Todo[]>;
  getById(id: string): Promise<Todo | undefined>;
  create({ title, ownerId }: { title: string; ownerId: string }): Promise<Todo>;
}
