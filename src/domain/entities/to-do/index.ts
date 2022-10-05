import Serializable from '../../serialization/serializable';
import Saveable from '../../../data-access/persistence/saveable';

export default interface Todo extends Serializable, Saveable {
  getTitle(): string;
}
