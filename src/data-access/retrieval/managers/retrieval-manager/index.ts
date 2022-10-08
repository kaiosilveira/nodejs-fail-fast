import Todo from '../../../../domain/entities/to-do';

export default interface RetrievalManager<T> {
  list(): Promise<T[]>;
}

export interface TodoRetrievalManager extends RetrievalManager<Todo> {}
