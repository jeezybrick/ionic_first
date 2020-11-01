import { Component } from '@angular/core';
import { BoardTypes } from '../../../shared/enums/board-types.enum';
import { ModalController, PopoverController } from '@ionic/angular';
import { BoardTypeInfoPopoverComponent } from '../board-type-info-popover/board-type-info-popover.component';

@Component({
  selector: 'app-choose-board-by-type-modal',
  templateUrl: './choose-board-by-type-modal.component.html',
  styleUrls: ['./choose-board-by-type-modal.component.scss'],
})
export class ChooseBoardByTypeModalComponent {

  public checkedBoardType: BoardTypes;
  public boardTypes: {type: BoardTypes, infoText: string}[] = [
    {
      type: BoardTypes.Scrum,
      infoText: 'Дотримуючись методу Scrum, ви маєте можливість створювати спринти та задачі у них. Проектна команда може почати наступний спринт тільки коли попередній закінчений.',
    },
    {
      type: BoardTypes.Kanban,
      infoText: 'Дотримуючись моделі Kanban, ви маєте можливість вільно пересуватися між стадіями розробки та призупинити виконання завдання на будь-якому етапі в разі, якщо з\'явилися інші термінові завдання або змінився пріоритет поточної.'
    },
    {
      type: BoardTypes.Waterflow,
      infoText: 'Дотримуючись моделі Waterflow, ви маєте можливість переходити від однієї стадії до іншої строго послідовно.'
    },
    {
      type: BoardTypes.Dedault,
      infoText: 'Вибираючи Вільний метод, ви маєте можливість створювати будь-які колонки і переміщуватися вільно між ними.'
    },
  ];

  constructor(public modalController: ModalController, public popoverController: PopoverController) {
  }

  public dismiss() {
    this.modalController.dismiss();
  }

  public chooseBoardType(boardType: BoardTypes): void {
    this.checkedBoardType = boardType;
  }

  public submit() {
    this.modalController.dismiss(this.checkedBoardType);
  }

  async showInfoPopover(ev: Event, boardInfoText: string) {
    ev.stopPropagation();
    const popover = await this.popoverController.create({
      component: BoardTypeInfoPopoverComponent,
      event: ev,
      translucent: false,
      componentProps: {
        text: boardInfoText,
      },
    });
    return await popover.present();
  }

}
