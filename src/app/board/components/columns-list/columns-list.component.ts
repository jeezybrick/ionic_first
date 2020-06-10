import { Component, OnInit } from '@angular/core';
import { Column } from '../../../shared/models/column.model';
import { BoardService } from '../../../shared/services/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnService } from '../../../shared/services/column.service';
import { CardService } from '../../../shared/services/card.service';
import { Board } from '../../../shared/models/board.model';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CreateColumnModalComponent } from '../create-column-modal/create-column-modal.component';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-columns-list',
    templateUrl: './columns-list.component.html',
    styleUrls: ['./columns-list.component.scss'],
})
export class ColumnsListComponent implements OnInit {
    public columns: Column[] = [];
    public board: Board;
    public isBoardLoading = true;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private boardService: BoardService,
                private modalController: ModalController,
                private actionSheetController: ActionSheetController,
                private columnService: ColumnService,
                private loaderService: LoaderService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (!params.boardId) {
                this.router.navigate(['boards']);
            }

            this.getBoardDetail(params.boardId);

        });
    }

    async createColumn() {
        const modal = await this.modalController.create({
            component: CreateColumnModalComponent,
            componentProps: {
                boardId: this.board._id,
            }
        });

        modal.onWillDismiss().then((res) => {
            if (res && res.data) {
                this.columns = [...this.columns, res.data.createdColumn];
            }
        });

        return await modal.present();
    }

    async presentActionSheet(columnId: string) {
        const actionSheet = await this.actionSheetController.create({
            header: 'Колонки',
            buttons: [{
                text: 'Удалить',
                role: 'destructive',
                handler: () => {
                    this.removeColumn(columnId);
                }
            }, {
                text: 'Отмена',
                role: 'cancel'
            }]
        });
        await actionSheet.present();
    }

    private getBoardDetail(boardId): void {
        this.boardService.getBoardDetail(boardId).subscribe((response: Board) => {
            if (response) {
                this.board = response;
                this.columns = [...response.columns];
                this.boardService.setActiveBoard(response);
            } else {
                this.router.navigate(['boards']);
            }

            this.isBoardLoading = false;
        }, (error) => {
            this.router.navigate(['boards']);
        });
    }

    private async removeColumn(columnId: string) {
        await this.loaderService.presentLoading('Удаление...');

        this.columnService.deleteColumn(columnId)
            .pipe(finalize(() => this.loaderService.dismissLoading()))
            .subscribe((response: Column[]) => {

                    const index = this.columns.findIndex((item) => item._id === columnId);

                    if (index > -1) {
                        this.toastService.presentToast('Колонка упешно удалена');
                        this.columns.splice(index, 1);
                    }
                },
                (error) => {
                    this.toastService.presentErrorToast();
                });
    }

}
