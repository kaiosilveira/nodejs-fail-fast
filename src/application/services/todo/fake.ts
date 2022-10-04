import TodoService from '.';

export default class FakeTodoService implements TodoService {
  async createTodo(): Promise<number> {
    return Promise.resolve(1);
  }
}
