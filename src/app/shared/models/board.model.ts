import { Base } from './base.model';
import { Column } from './column.model';
import { User } from './user.model';
import { BoardTypes } from '../enums/board-types.enum';

export class Board extends Base {
  columns?: Column[];
  createdAt: string;
  owner: User | string;
  users?: User[];
  type?: BoardTypes;
}
