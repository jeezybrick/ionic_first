import { Note } from './note.model';
import { Base } from './base.model';
import { CardPrioritiesEnum } from '../services/card.service';
import { User } from './user.model';
import { CardLogTimeSuffixType } from '../interfaces/card-log-time-submit-data.interface';

export class Card extends Base {
  notes: Note[];
  position: number;
  columnId: string;
  description: string;
  priority: CardPrioritiesEnum;
  priorityName?: string;
  users?: User[];
  owner?: User | string;
  loggedTime?: { date: string | Date; value: number; suffix: CardLogTimeSuffixType }[];
  estimateTime?: { value: number; suffix: CardLogTimeSuffixType };
}
