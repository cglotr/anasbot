export interface Storage<T> {
  add(item: T): boolean;
  list(): Array<T>;
  remove(item: T): boolean;
}
