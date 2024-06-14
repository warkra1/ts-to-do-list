export class ToDoListError extends Error {
  static invalidNumber(): ToDoListError {
    return new ToDoListError('Invalid item number');
  }
}
