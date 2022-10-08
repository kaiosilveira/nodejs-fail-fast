import Serializable from '../../serialization/serializable';
import Saveable from '../../../data-access/persistence/saveable';
import Queryable from '../../../data-access/retrieval/queryable';

export default interface Todo extends Serializable, Saveable, Queryable<Todo> {
  getId(): string;
  getTitle(): string;
}
