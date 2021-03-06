import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Board } from '../../../shared/models/board.model';
import { BoardService } from '../../../shared/services/board.service';
import { CreateBoardModalComponent } from '../create-board-modal/create-board-modal.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { delay, finalize } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { Observable } from 'rxjs';
import { BoardTypes } from '../../../shared/enums/board-types.enum';
import { ChooseBoardByTypeModalComponent } from '../choose-board-by-type-modal/choose-board-by-type-modal.component';

@Component({
    selector: 'app-boards-list',
    templateUrl: './boards-list.component.html',
    styleUrls: ['./boards-list.component.scss'],
})
export class BoardsListComponent implements OnInit, OnDestroy {
    public currentUser$: Observable<User>;
    public boards: Board[] = [];
    public isBoardsListLoading = true;
    private subs = new SubSink();

    constructor(
        private modalController: ModalController,
        private boardService: BoardService,
        private toastService: ToastService,
        private authService: AuthService,
        private loaderService: LoaderService) {
    }

    ngOnInit() {
        this.getBoardList();
        this.currentUser$ = this.authService.getUser();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    async showChooseBoardByTypeModal() {
        const modal = await this.modalController.create({
            component: ChooseBoardByTypeModalComponent,
        });

        modal.onWillDismiss().then((res) => {
            if (res && res.data) {
                this.showCreateBoardModal(res.data);
            }
        });

        return await modal.present();
    }

    async showCreateBoardModal(boardType: BoardTypes = BoardTypes.Default) {
        const modal = await this.modalController.create({
            component: CreateBoardModalComponent,
            componentProps: {
                boardType,
            }
        });

        return await modal.present();
    }

    public async deleteBoard(event, boardId: string) {
        event.stopPropagation();
        event.preventDefault();
        await this.loaderService.presentLoading('Удаление...');

        this.subs.sink = this.boardService.deleteBoard(boardId)
            .pipe(finalize(() => this.loaderService.dismissLoading()))
            .subscribe((response: any) => {
                    this.toastService.presentToast('Доска упешно удалена');

                    this.isBoardsListLoading = true;
                    this.getBoardList();
                },
                (error) => {
                    this.toastService.presentErrorToast();
                });
    }

    public reloadData(event): void {
        this.getBoardList(event);
    }

    private getBoardList(event?): void {
        this.subs.sink = this.boardService.getBoards()
            .pipe(
                delay(1000)
            )
            .subscribe((response: Board[]) => {
                    this.boards = response;
                    this.isBoardsListLoading = false;

                    if (event) {
                        event.target.complete();
                    }
                },
                (error) => {
                    this.toastService.presentErrorToast();
                });

    }

}
