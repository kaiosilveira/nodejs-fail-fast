import Serializable from '../../serialization/serializable';
import Saveable from '../../../data-access/persistence/saveable';
import { QueryableTodo } from '../../../data-access/retrieval/queryable';

export default interface Todo extends Serializable, Saveable, QueryableTodo {
  getId(): string;
  getById(id: string): Promise<Todo>;
  getOwnerId(): string;
  getTitle(): string;
}
