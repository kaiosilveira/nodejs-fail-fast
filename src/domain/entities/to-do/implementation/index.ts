import Todo from '..';
import { TodoPersistenceManager } from '../../../../data-access/persistence/managers/persistence-manager';

export type ConcreteTodoProps = {
  title: string;
  id?: string;
  persistenceManager?: TodoPersistenceManager;
};

export default class ConcreteTodo implements Todo {
  private _id: string;
  private _title: string;
  private readonly _persistenceManager?: TodoPersistenceManager;

  constructor(props: ConcreteTodoProps) {
    this._id = props.id ?? '';
    this._title = props.title;

    if (props.persistenceManager) this._persistenceManager = props.persistenceManager;
  }

  getId() {
    return this._id;
  }

  getTitle(): string {
    return this._title;
  }

  async save(): Promise<string> {
    if (this._persistenceManager) this._id = await this._persistenceManager?.save(this);
    return this._id;
  }

  toJSON(): object {
    return { title: this._title };
  }
}
