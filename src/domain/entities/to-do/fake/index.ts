import Todo from '..';

export default class FakeTodo implements Todo {
  list(): Promise<Todo[]> {
    throw new Error('Method not implemented.');
  }
  getById(id: number): Promise<Todo> {
    throw new Error('Method not implemented.');
  }
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
