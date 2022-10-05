import Todo from "..";

export default class ConcreteTodo implements Todo {
  private _title;

  constructor(title: string) {
    this._title = title;
  }

  getTitle() {
    return this._title;
  }

  save(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
