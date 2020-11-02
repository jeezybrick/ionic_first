import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { Card } from '../../../shared/models/card.model';
import { SubSink } from 'subsink';
import { ColumnService } from '../../../shared/services/column.service';
import { Column } from '../../../shared/models/column.model';
import { filter, finalize, map } from 'rxjs/operators';
import { CardService, UpdateCardPositionInterface } from '../../../shared/services/card.service';
import { BoardTypes } from '../../../shared/enums/board-types.enum';

@Component({
    selector: 'app-card-move-to-column-modal',
    templateUrl: './card-move-to-column-modal.component.html',
    styleUrls: ['./card-move-to-column-modal.component.scss'],
})
export class CardMoveToColumnModalComponent implements OnInit, OnDestroy {
    public columns: Column[] = [];
    public checkedColumnId: string;
    public isColumnsLoading: boolean = true;
    private subs = new SubSink();

    @Input() card: Card;
    @Input() boardType: BoardTypes;

    constructor(public modalController: ModalController,
                private columnService: ColumnService,
                private cardService: CardService,
                private toastService: ToastService,
                private loaderService: LoaderService) {
    }


    ngOnInit() {
        this.subs.sink = this.columnService.getColumns(this.card.column.board as string)
            .pipe(
                map(columns => this.boardType === BoardTypes.Waterflow ? this.getFilteredColumnsForWaterflow(columns) : columns),
            )
            .subscribe((columns) => {
                this.checkedColumnId = this.card.column._id;
                this.columns = columns;
                this.isColumnsLoading = false;
            });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    public dismiss(data?) {
        this.modalController.dismiss(data);
    }

    public chooseColumn(columnId: string): void {
        this.checkedColumnId = columnId;
    }

    public async submit() {
        await this.loaderService.presentLoading('Сохранение...');
        const newColumn: Column = this.columns.find(item => item._id === this.checkedColumnId);
        const data: UpdateCardPositionInterface = {
            previousColumnId: this.card.column._id,
            currentColumnId: newColumn._id,
            currentIndex: newColumn.cards.length,
            previousIndex: this.card.position,
            cardId: this.card._id,
        };

        this.subs.sink = this.cardService.updatePosition(data)
            .pipe(finalize(() => this.loaderService.dismissLoading()))
            .subscribe((response: Card[]) => {
                this.dismiss(response);
                this.toastService.presentToast('Карточка успешно перемещена');
            }, (error) => {
                this.toastService.presentErrorToast();
            });
    }

    private getFilteredColumnsForWaterflow(columns: Column[]): Column[] {
      const currentColumnIndex = columns.findIndex(column => column._id === this.card.column._id);
      const columnsArr = [columns[currentColumnIndex]];

      if (columns.length === 1) {
        return columnsArr;
      }

      if (columns.length === 2) {
        if (currentColumnIndex === this.columns.length - 1) {
          columnsArr.unshift(this.columns[currentColumnIndex - 1]);
        } else {
          columnsArr.push(this.columns[currentColumnIndex + 1]);
        }

        return columnsArr;
      }


      if (currentColumnIndex === columns.length - 1) {
        columnsArr.unshift(columns[currentColumnIndex - 1]);
      } else {
        columnsArr.unshift(columns[currentColumnIndex - 1]);
        columnsArr.push(columns[currentColumnIndex + 1]);
      }

      return columnsArr;
    }


}
