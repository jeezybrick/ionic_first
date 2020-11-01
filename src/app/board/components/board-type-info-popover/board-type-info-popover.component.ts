import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-board-type-info-popover',
  templateUrl: './board-type-info-popover.component.html',
  styleUrls: ['./board-type-info-popover.component.scss'],
})
export class BoardTypeInfoPopoverComponent {
  @Input() text: string;
}
