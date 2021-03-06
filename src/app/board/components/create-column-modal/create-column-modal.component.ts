import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BoardService } from '../../../shared/services/board.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { finalize } from 'rxjs/operators';
import { ColumnService } from '../../../shared/services/column.service';
import { Column } from '../../../shared/models/column.model';

@Component({
  selector: 'app-create-column-modal',
  templateUrl: './create-column-modal.component.html',
  styleUrls: ['./create-column-modal.component.scss'],
})
export class CreateColumnModalComponent {
  public columnName = '';
  @Input() boardId: string;

  constructor(public modalController: ModalController,
              private router: Router,
              private boardService: BoardService,
              private toastService: ToastService,
              private columnService: ColumnService,
              private loaderService: LoaderService) {
  }

  public dismiss(data?) {
    this.modalController.dismiss(data);
  }

  public async createColumn() {
    await this.loaderService.presentLoading('Cохранение...');

    this.columnService.createColumn(this.boardId, {name: this.columnName})
        .pipe(finalize(() => this.loaderService.dismissLoading()))
        .subscribe((response: Column) => {
          this.toastService.presentToast('Колонка успішно додана');
          this.dismiss({createdColumn: response});
    });
  }

}
