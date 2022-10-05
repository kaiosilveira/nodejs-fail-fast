import Todo from '..';

export default interface TodoBuilder {
  withTitle(title: string): TodoBuilder;
  build(): Todo;
}
