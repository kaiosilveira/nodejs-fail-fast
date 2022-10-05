export default interface Saveable {
  save(): Promise<string>;
}
