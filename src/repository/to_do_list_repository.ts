import {AbstractFileRepository} from './abstract_file_repository';
import {ToDoList} from '../models/ToDoList';
import {ToDoItem} from '../models/to_do_item';

export class ToDoListRepository extends AbstractFileRepository<ToDoList> {
  protected deserialize(data: any): ToDoList {
    const items = [];
    for (const item of data.items) {
      items.push(new ToDoItem(item.title));
    }
    return new ToDoList(items);
  }

  protected serialize(obj: ToDoList): any {
    const data: any = {items: []};
    for (const item of obj.items) {
      data.items.push({title: item.title});
    }
    return data;
  }
}
