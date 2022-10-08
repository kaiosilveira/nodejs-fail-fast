export default interface Queryable<T> {
  list(): Promise<T[]>;
  getById(id: number): Promise<T>;
}
