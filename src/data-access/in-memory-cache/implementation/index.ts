import InMemoryCache from '..';

export default class ConcreteInMemoryCache implements InMemoryCache {
  exists(key: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  set(key: string, value: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get(key: string): Promise<string | undefined> {
    throw new Error('Method not implemented.');
  }
}
