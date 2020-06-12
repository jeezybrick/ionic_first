import { Note } from './note.model';
import { Base } from './base.model';
import { CardPrioritiesEnum } from '../services/card.service';

export class Card extends Base {
  notes: Note[];
  position: number;
  columnId: string;
  priority: CardPrioritiesEnum;
  priorityName?: string;
}
