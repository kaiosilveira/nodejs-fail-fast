import Todo from '..';

export default class FakeTodo implements Todo {
  getTitle(): string {
    throw new Error('Method not implemented.');
  }
  save(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  toJSON(): object {
    throw new Error('Method not implemented.');
  }
}
