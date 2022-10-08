import Todo from '../../../domain/entities/to-do';

export default interface Queryable<T> {
  list(): Promise<T[]>;
  getById(id: string): Promise<T>;
}

export interface QueryableTodo extends Queryable<Todo> {
  listByOwnerId(ownerId: string): Promise<Todo[]>;
}
