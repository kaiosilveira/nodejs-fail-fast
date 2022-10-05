import Todo from '..';
import ConcreteTodo from '../implementation';

export default class TodoBuilder {
  private _title: string;

  constructor() {
    this._title = '';
  }

  withTitle(title: string): TodoBuilder {
    if (!title) throw new Error('Invalid title. Expected a non-empty string.');
    this._title = title;
    return this;
  }

  build(): Todo {
    return new ConcreteTodo(this._title);
  }
}
