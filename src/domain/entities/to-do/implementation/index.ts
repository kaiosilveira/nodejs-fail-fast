import Todo from '..';

export type ConcreteTodoProps = {
  title: string;
  ownerId: string;
  id?: string;
};

export default class ConcreteTodo implements Todo {
  private _id: string;
  private _title: string;
  private _ownerId: string;

  constructor(props: ConcreteTodoProps) {
    this._id = props.id ?? '';
    this._ownerId = props.ownerId;
    this._title = props.title;
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
}
