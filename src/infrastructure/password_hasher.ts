import {md5} from 'js-md5';
import {User} from '../models/user';

export class PasswordHasher {
  static hashPassword(password: string): string {
    return md5(password);
  }

  static checkPassword(user: User, password: string): boolean {
    return user.password === md5(password);
  }
}
