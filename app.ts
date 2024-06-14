import {UserRepository} from './src/repository/user_repository';
import {ToDoListRepository} from './src/repository/to_do_list_repository';
import {User} from './src/models/user';
import {ToDoList} from './src/models/ToDoList';
import {ToDoItem} from './src/models/to_do_item';
import {AuthService} from './src/service/AuthService';
import {ToDoListService} from './src/service/ToDoListService';
import {CommandProcessor} from './src/command_processor';

function bootstrap() {
  const userRepository = new UserRepository(__dirname + '/data/users');
  const toDoListRepository = new ToDoListRepository(__dirname + '/data/lists');
  const authService = new AuthService(userRepository);
  const toDoListService = new ToDoListService(toDoListRepository);
  const commandProcessor = new CommandProcessor(authService, toDoListService);

  return {
    userRepository,
    toDoListRepository,
    authService,
    toDoListService,
    commandProcessor,
  };
}

const {commandProcessor} = bootstrap();

commandProcessor.run();
