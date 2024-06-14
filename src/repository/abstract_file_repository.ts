import {RepositoryInterface} from './repository_interface';

export abstract class AbstractFileRepository<T>
  implements RepositoryInterface<T>
{
  constructor(private path: string) {}

  read(id: string): T {
    const fs = require('fs');
    const filename = `${this.path}/${id}.json`;
    if (!fs.existsSync(filename)) {
      throw new ModelNotFoundError();
    }

    return this.deserialize(JSON.parse(fs.readFileSync(filename)));
  }

  write(id: string, obj: T) {
    const fs = require('fs');
    const filename = `${this.path}/${id}.json`;
    fs.writeFileSync(filename, JSON.stringify(this.serialize(obj)));
  }

  protected abstract serialize(obj: T): any;

  protected abstract deserialize(data: any): T;
}
