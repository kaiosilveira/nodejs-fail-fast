import TodoBuilder from '..';
import toDo from '../..';

export default class FakeTodoBuilder implements TodoBuilder {
  withOwnerId(ownerId: string): TodoBuilder {
    throw new Error('Method not implemented.');
  }
  withTitle(title: string): TodoBuilder {
    throw new Error('Method not implemented.');
  }
  build(): toDo {
    throw new Error('Method not implemented.');
  }
}
