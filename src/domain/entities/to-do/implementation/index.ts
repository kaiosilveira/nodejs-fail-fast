import Todo from '..';
import { TodoPersistenceManager } from '../../../../data-access/persistence/managers/persistence-manager';
import { TodoRetrievalManager } from '../../../../data-access/retrieval/managers/retrieval-manager';

export type ConcreteTodoProps = {
  title: string;
  ownerId: string;
  id?: string;
  persistenceManager?: TodoPersistenceManager;
  retrievalManager?: TodoRetrievalManager;
};

export default class ConcreteTodo implements Todo {
  private _id: string;
  private _title: string;
  private _ownerId: string;
  private readonly _persistenceManager?: TodoPersistenceManager;
  private readonly _retrievalManager?: TodoRetrievalManager;

  constructor(props: ConcreteTodoProps) {
    this._id = props.id ?? '';
    this._ownerId = props.ownerId;
    this._title = props.title;
    this._retrievalManager = props.retrievalManager;

    if (props.persistenceManager) this._persistenceManager = props.persistenceManager;
  }

  getOwnerId(): string {
    return this._ownerId;
  }

  getId() {
    return this._id;
  }

  getTitle(): string {
    return this._title;
  }

  toJSON(): object {
    return { title: this._title, ownerId: this._ownerId };
  }

  async save(): Promise<string> {
    if (this._persistenceManager) {
      this._id = await this._persistenceManager?.save(this);
      return this._id;
    } else throw new Error(`No persistance manager was defined for to-do`);
  }

  async list(): Promise<Todo[]> {
    if (this._retrievalManager) return this._retrievalManager?.list();
    else throw new Error(`No retrieval manager was defined for to-do with id "${this._id}"`);
  }

  async getById(id: string): Promise<Todo> {
    if (!id) throw new Error('Failed to list to-do by id. Invalid identifier.');
    else return Promise.resolve(new ConcreteTodo({ id, title: 't', ownerId: 'system' }));
  }
}
