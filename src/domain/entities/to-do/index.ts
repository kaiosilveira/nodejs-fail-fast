export default interface Todo {
  getTitle(): string;
  save(): Promise<string>;
}
