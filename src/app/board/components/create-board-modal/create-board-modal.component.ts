import { Component, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BoardService } from '../../../shared/services/board.service';
import { Board } from '../../../shared/models/board.model';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-create-board-modal',
    templateUrl: './create-board-modal.component.html',
    styleUrls: ['./create-board-modal.component.scss'],
})
export class CreateBoardModalComponent implements OnDestroy {
    public boardName = '';
    public selectedUsers = [];
    private subs = new SubSink();

    constructor(public modalController: ModalController,
                private boardService: BoardService,
                private toastService: ToastService,
                private loaderService: LoaderService) {
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    public dismiss() {
        this.modalController.dismiss();
    }

    public onUserSelected(selectedUser): void {
        this.selectedUsers = [...this.selectedUsers, selectedUser];
    }


    public removeSelectedUser(user): void {
        this.selectedUsers = this.selectedUsers.filter(item => item._id !== user._id);
    }

    public async createBoard() {
        await this.loaderService.presentLoading('Cохранение...');

        this.subs.sink = this.boardService.createBoard({name: this.boardName, users: this.selectedUsers.map(item => item._id)})
            .pipe(finalize(() => this.loaderService.dismissLoading()))
            .subscribe((response: Board) => {
                this.dismiss();
                this.toastService.presentToast('Доска упешно создана');
            }, (error) => {
                this.toastService.presentErrorToast();
            });
    }

}
