import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { delay, finalize, shareReplay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AddUserToBoardModalComponent } from '../add-user-to-board-modal/add-user-to-board-modal.component';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    selector: 'app-columns-list',
    templateUrl: './columns-list.component.html',
    styleUrls: ['./columns-list.component.scss'],
})
export class ColumnsListComponent implements OnInit, OnDestroy {
    public columns: Column[] = [];
    public board: Board;
    public boardId: string;
    public isBoardLoading = true;
    public currentUser$: Observable<User>;
    public currentUserId: string;
    private subs = new SubSink();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private boardService: BoardService,
                private modalController: ModalController,
                private actionSheetController: ActionSheetController,
                private columnService: ColumnService,
                private loaderService: LoaderService,
                private authService: AuthService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.currentUser$ = this.authService.getUser().pipe(shareReplay(1));
        this.subs.sink = this.authService.getUser().subscribe(currentUser => this.currentUserId = currentUser._id);
        this.subs.sink = this.route.params.subscribe((params) => {
            this.boardId = params.boardId;
            this.getBoardDetail(this.boardId);
        });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    async createColumn() {
        const modal = await this.modalController.create({
            component: CreateColumnModalComponent,
            componentProps: {
                boardId: this.boardId,
            }
        });

        modal.onWillDismiss().then((res) => {
            if (res && res.data) {
                this.columns = [...this.columns, res.data.createdColumn];
            }
        });

        return await modal.present();
    }

    async addUsersToBoard() {
        const modal = await this.modalController.create({
            component: AddUserToBoardModalComponent,
            componentProps: {
                board: this.board,
            }
        });

        modal.onWillDismiss().then((res) => {
            if (res && res.data) {
                this.board.users = [...res.data];
            }
        });

        return await modal.present();
    }

    public async removeUserFromBoard(event, user: User) {
        event.stopPropagation();
        event.preventDefault();
        await this.loaderService.presentLoading('Удаление...');

        this.subs.sink = this.boardService.removeUsersFromBoard(this.boardId, [user._id])
            .pipe(finalize(() => this.loaderService.dismissLoading()))
            .subscribe((response: User[]) => {
                    this.toastService.presentToast('Пользователь успешно удален с доски');
                    this.board.users = [...response];
                },
                (error) => {
                    this.toastService.presentErrorToast();
                });
    }

    async presentActionSheet(event, columnId: string) {
        event.stopPropagation();
        event.preventDefault();

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

    public reloadData(event): void {
        this.getBoardDetail(this.route.snapshot.params.boardId, event);
    }

    private getBoardDetail(boardId: string = this.boardId, event?): void {
        this.subs.sink = this.boardService.getBoardDetail(boardId)
            .pipe(
                delay(1000)
            )
            .subscribe((response: Board) => {
            this.board = response;
            this.columns = [...response.columns];
            this.isBoardLoading = false;

            if (event) {
                event.target.complete();
            }
        }, (error) => {
            this.router.navigate(['boards']);
        });
    }

    private async removeColumn(columnId: string) {
        await this.loaderService.presentLoading('Удаление...');

        this.subs.sink = this.columnService.deleteColumn(columnId)
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
