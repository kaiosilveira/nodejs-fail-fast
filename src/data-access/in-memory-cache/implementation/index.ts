import InMemoryCache from '..';

const CACHE = {};

export default class ConcreteInMemoryCache implements InMemoryCache {
  async exists(key: string): Promise<boolean> {
    return Promise.resolve(Object.keys(CACHE).some(k => k === key));
  }

  async set(key: string, value: string): Promise<void> {
    Promise.resolve((CACHE[key] = value));
  }

  async get(key: string): Promise<string | undefined> {
    return Promise.resolve(CACHE[key]);
  }
}
