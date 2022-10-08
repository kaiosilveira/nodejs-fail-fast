import Serializable from '../../serialization/serializable';

export default interface Todo extends Serializable {
  getId(): string;
  getOwnerId(): string;
  getTitle(): string;
}
