export interface RepositoryInterface<T> {
  read(id: string): T;

  write(id: string, obj: T): void;
}
