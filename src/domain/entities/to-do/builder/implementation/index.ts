import TodoBuilder from '..';
import Todo from '../..';
import { TodoPersistenceManager } from '../../../../../data-access/persistence/managers/persistence-manager';
import { TodoRetrievalManager } from '../../../../../data-access/retrieval/managers/retrieval-manager';
import ConcreteTodo from '../../implementation';

export default class ConcreteTodoBuilder implements TodoBuilder {
  private _title: string;
  private _ownerId: string;

  constructor(
    private readonly persistenceManager?: TodoPersistenceManager,
    private readonly retrievalManager?: TodoRetrievalManager
  ) {
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
    return new ConcreteTodo({
      title: this._title,
      ownerId: this._ownerId,
      persistenceManager: this.persistenceManager,
      retrievalManager: this.retrievalManager,
    });
  }
}
