import Todo from '..';

export default interface TodoBuilder {
  withOwnerId(ownerId: string): TodoBuilder;
  withTitle(title: string): TodoBuilder;
  build(): Todo;
}
