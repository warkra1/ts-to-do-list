import {User} from '../models/user';
import {UserRepository} from '../repository/user_repository';
import {AuthError} from './error/auth_error';
import {PasswordHasher} from '../infrastructure/password_hasher';

export class AuthService {
  private user: User | null = null;

  constructor(private repository: UserRepository) {}

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
    if (this.repository.exists(login)) {
      throw AuthError.userAlreadyExists();
    }

    const user = new User(login, PasswordHasher.hashPassword(password));
    this.repository.write(login, user);
    this.user = user;
  }
}
