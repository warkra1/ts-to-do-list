import {AbstractFileRepository} from './abstract_file_repository';
import {User} from '../models/user';

export class UserRepository extends AbstractFileRepository<User> {
  protected deserialize(data: any): User {
    return new User(data.login, data.password);
  }

  protected serialize(obj: User): any {
    return {login: obj.login, password: obj.password};
  }
}
