export default interface InMemoryCache {
  set(key: string, value: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  get(key: string): Promise<string | undefined>;
}
