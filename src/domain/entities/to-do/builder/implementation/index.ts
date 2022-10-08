import Todo from '../..';
import ConcreteTodo from '../../implementation';

export default class ConcreteTodoBuilder {
  private _title: string;
  private _ownerId: string;

  constructor() {
    this._title = '';
    this._ownerId = '';
  }

  withTitle(title: string): ConcreteTodoBuilder {
    if (!title) throw new Error('Invalid title. Expected a non-empty string.');
    this._title = title;
    return this;
  }

  withOwnerId(ownerId: string): ConcreteTodoBuilder {
    if (!ownerId) throw new Error('Invalid ownerId. Expected a non-empty string.');
    this._ownerId = ownerId;
    return this;
  }

  build(): Todo {
    return new ConcreteTodo({ title: this._title, ownerId: this._ownerId });
  }
}
