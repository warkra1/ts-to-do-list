export class AuthError extends Error {
  static userNotFound(): AuthError {
    return new AuthError('User not found!');
  }

  static invalidPassword(): AuthError {
    return new AuthError('Invalid password!');
  }

  static userAlreadyExists(): AuthError {
    return new AuthError('User Already Exists');
  }
}
