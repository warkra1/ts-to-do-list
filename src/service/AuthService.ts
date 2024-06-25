import {User} from '../models/user';
import {UserRepository} from '../repository/user_repository';
import {AuthError} from './error/auth_error';
import {PasswordHasher} from '../infrastructure/password_hasher';
import {RepositoryInterface} from '../repository/repository_interface';

export class AuthService {
  private user: User | null = null;

  constructor(private repository: RepositoryInterface<User>) {}

  get currentUser(): User | null {
    return this.user;
  }

  login(login: string, password: string) {
    let user: User;
    try {
      user = this.repository.read(login);
    } catch (e) {
      throw AuthError.userNotFound();
    }

    if (!PasswordHasher.checkPassword(user, password)) {
      throw AuthError.invalidPassword();
    }
    this.user = user;
  }

  register(login: string, password: string) {
    if (this.exists(login)) {
      throw AuthError.userAlreadyExists();
    }

    const user = new User(login, PasswordHasher.hashPassword(password));
    this.repository.write(login, user);
    this.user = user;
  }

  private exists(login: string): boolean {
    try {
      this.repository.read(login);
      return true;
    } catch (e) {
      return false;
    }
  }
}
