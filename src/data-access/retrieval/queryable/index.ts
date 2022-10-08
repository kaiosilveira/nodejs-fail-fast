export default interface Queryable<T> {
  list(): Promise<T[]>;
  getById(id: string): Promise<T>;
}
