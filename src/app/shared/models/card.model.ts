import { Note } from './note.model';
import { Base } from './base.model';
import { CardPrioritiesEnum } from '../services/card.service';
import { User } from './user.model';

export class Card extends Base {
  notes: Note[];
  position: number;
  columnId: string;
  description: string;
  priority: CardPrioritiesEnum;
  priorityName?: string;
  users?: User[];
}
