import Todo from '../../../../domain/entities/to-do';

export default interface RetrievalManager<T> {
  list(): Promise<T[]>;
  getById(id: string): Promise<T>;
}

export interface TodoRetrievalManager extends RetrievalManager<Todo> {}
