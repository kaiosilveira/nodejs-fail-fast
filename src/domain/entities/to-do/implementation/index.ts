import Todo from '..';
import { TodoPersistenceManager } from '../../../../data-access/persistence/managers/persistence-manager';

export type ConcreteTodoProps = {
  title: string;
  ownerId: string;
  id?: string;
  persistenceManager?: TodoPersistenceManager;
};

export default class ConcreteTodo implements Todo {
  private _id: string;
  private _title: string;
  private _ownerId: string;
  private readonly _persistenceManager?: TodoPersistenceManager;

  constructor(props: ConcreteTodoProps) {
    this._id = props.id ?? '';
    this._ownerId = props.ownerId;
    this._title = props.title;

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
    if (this._persistenceManager) this._id = await this._persistenceManager?.save(this);
    return this._id;
  }

  async list(): Promise<Todo[]> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<Todo> {
    throw new Error('Method not implemented.');
  }
}
