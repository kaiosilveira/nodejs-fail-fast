import Todo from '..';

export type ConcreteTodoProps = { id?: string; title: string };
export default class ConcreteTodo implements Todo {
  private _id?: string;
  private _title: string;

  constructor(props: ConcreteTodoProps) {
    this._id = props.id;
    this._title = props.title;
  }

  getId() {
    return this._id;
  }

  getTitle(): string {
    return this._title;
  }

  save(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  toJSON(): object {
    return { title: this._title };
  }
}
