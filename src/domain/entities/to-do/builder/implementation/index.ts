import Todo from '../..';
import ConcreteTodo from '../../implementation';

export default class ConcreteTodoBuilder {
  private _title: string;

  constructor() {
    this._title = '';
  }

  withTitle(title: string): ConcreteTodoBuilder {
    if (!title) throw new Error('Invalid title. Expected a non-empty string.');
    this._title = title;
    return this;
  }

  build(): Todo {
    return new ConcreteTodo({ title: this._title });
  }
}
