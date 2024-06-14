import {AuthService} from './service/AuthService';
import {ToDoListService} from './service/ToDoListService';
import * as readline from 'readline/promises';
import {read} from 'node:fs';
import {ToDoItem} from './models/to_do_item';
import {AuthError} from './service/error/auth_error';

enum Commands {
  login = 'login',
  register = 'register',
  getList = 'get_list',
  createItem = 'create_item',
  updateItem = 'update_item',
  deleteItem = 'delete_item',
  exit = 'exit',
  help = 'help',
}

export class CommandProcessor {
  private rl: readline.Interface;

  constructor(
    private authService: AuthService,
    private toDoListService: ToDoListService
  ) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async run() {
    console.log('Hello, this is a to do list CLI App');
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const ans = await this.rl.question(
        'Please, Enter a command (or type "help" to see all commands): '
      );

      switch (ans) {
        case Commands.login:
          await this.login();
          break;
        case Commands.register:
          await this.register();
          break;
        case Commands.getList:
          await this.getList();
          break;
        case Commands.createItem:
          await this.createItem();
          break;
        case Commands.updateItem:
          await this.updateItem();
          break;
        case Commands.deleteItem:
          await this.deleteItem();
          break;
        case Commands.help:
          this.help();
          break;
        case Commands.exit:
          this.exit();
          break;
        default:
          console.warn('Invalid command!');
      }
    }
  }

  private async login() {
    const login = await this.rl.question('Enter login: ');
    const password = await this.rl.question('Enter password: ');
    try {
      this.authService.login(login, password);
      console.log('Successfully logged in!');
    } catch (e: any) {
      console.error(e.message);
    }
  }

  private async register() {
    const login = await this.rl.question('Enter login: ');
    const password = await this.rl.question('Enter password: ');
    try {
      this.authService.register(login, password);
      console.log('Successfully registered!');
    } catch (e: any) {
      console.error(e.message);
    }
  }

  private async getList() {
    if (!this.checkAuth()) return;

    const list = this.toDoListService.getList(this.authService.currentUser!);
    console.log('To Do List:');
    if (list.items.length === 0) {
      console.log('\tYour list is empty');
    } else {
      for (let i = 0; i < list.items.length; i++) {
        console.log(`\t[${i + 1}] ${list.items[i].title}`);
      }
    }
  }

  private async createItem() {
    if (!this.checkAuth()) return;

    const title = await this.rl.question('Enter title: ');
    const number = await this.askNumber('Enter number: ');

    this.toDoListService.createItem(
      this.authService.currentUser!,
      new ToDoItem(title),
      number - 1
    );

    console.log('Item successfully created!');
  }

  private async updateItem() {
    if (!this.checkAuth()) return;

    const number = await this.askNumber('Enter a number of item: ');
    const title = await this.rl.question('Enter new title: ');

    this.toDoListService.updateItem(
      this.authService.currentUser!,
      new ToDoItem(title),
      number - 1
    );

    console.log('Item successfully updated');
  }

  private async deleteItem() {
    if (!this.checkAuth()) return;

    const number = await this.askNumber('Enter a number of item: ');

    this.toDoListService.deleteItem(this.authService.currentUser!, number - 1);

    console.log('Item successfully deleted');
  }

  private help() {
    console.log('List of commands:');
    console.log(`\t${Commands.login} - authorize to application`);
    console.log(`\t${Commands.register} - create new user`);
    console.log(`\t${Commands.getList} - get current user's todo list`);
    console.log(`\t${Commands.createItem} - create a new item in todo list`);
    console.log(`\t${Commands.updateItem} - updates a specific item in list`);
    console.log(`\t${Commands.deleteItem} - deletes a specific item in list`);
    console.log(`\t${Commands.help} - show commands`);
    console.log(`\t${Commands.exit} - exit from application`);
  }

  private exit() {
    console.log('Bye!');
    // eslint-disable-next-line n/no-process-exit
    process.exit(0);
  }

  private checkAuth(): boolean {
    if (!this.authService.currentUser) {
      console.warn('You should login first!');
      return false;
    }
    return true;
  }

  private async askNumber(message: string) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const numberStr = await this.rl.question(message);
      const number = parseInt(numberStr);
      if (!isNaN(number)) {
        return number;
      }

      console.warn('Invalid number!');
    }
  }
}
