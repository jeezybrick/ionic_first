import { Base } from './base.model';
import { User } from './user.model';

export class Note extends Base {
  favorite: boolean;
  owner: User;
  likes?: User[];
}
