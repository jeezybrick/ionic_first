import { Card } from './card.model';
import { Base } from './base.model';
import { Board } from './board.model';

export class Column extends Base {
  cards: Card[];
  board: string | Board;
}
