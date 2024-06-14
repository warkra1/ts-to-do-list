import {ToDoListRepository} from '../repository/to_do_list_repository';
import {User} from '../models/user';
import {ToDoList} from '../models/ToDoList';
import {ToDoItem} from '../models/to_do_item';

export class ToDoListService {
  constructor(private repository: ToDoListRepository) {}

  private createList(user: User): ToDoList {
    const list = new ToDoList([]);
    this.repository.write(user.login, list);
    return list;
  }

  getList(user: User): ToDoList {
    try {
      return this.repository.read(user.login);
    } catch (e) {
      return this.createList(user);
    }
  }

  createItem(user: User, item: ToDoItem, number: number): ToDoList {
    const list = this.getList(user);
    list.items.splice(number, 0, item);
    this.repository.write(user.login, list);
    return list;
  }

  updateItem(user: User, item: ToDoItem, number: number): ToDoList {
    const list = this.getList(user);
    if (list.items[number] !== undefined) {
      list.items[number] = item;
    }
    this.repository.write(user.login, list);
    return list;
  }

  deleteItem(user: User, number: number): ToDoList {
    const list = this.getList(user);
    list.items.splice(number, 1);
    this.repository.write(user.login, list);
    return list;
  }
}
