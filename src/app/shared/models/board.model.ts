import { Base } from './base.model';
import { Column } from './column.model';
import { User } from './user.model';

export class Board extends Base {
  columns?: Column[];
  createdAt: string;
  owner: User | string;
  users?: User[];
}
