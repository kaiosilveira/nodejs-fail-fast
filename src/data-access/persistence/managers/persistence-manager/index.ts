import Todo from '../../../../domain/entities/to-do';

export default interface PersistenceManager<T> {
  save(obj: T): Promise<string>;
}

export interface TodoPersistenceManager extends PersistenceManager<Todo> {}
