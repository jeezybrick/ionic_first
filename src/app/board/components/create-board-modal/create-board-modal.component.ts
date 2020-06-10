import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BoardService } from '../../../shared/services/board.service';
import { Board } from '../../../shared/models/board.model';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'app-create-board-modal',
    templateUrl: './create-board-modal.component.html',
    styleUrls: ['./create-board-modal.component.scss'],
})
export class CreateBoardModalComponent implements OnInit {
    public boardName = '';

    constructor(public modalController: ModalController,
                private router: Router,
                private boardService: BoardService,
                private toastService: ToastService,
                private loaderService: LoaderService) {
    }

    ngOnInit() {
    }

    public dismiss() {
        this.modalController.dismiss();
    }

    public async createBoard() {
        await this.loaderService.presentLoading('Cохранение...');

        this.boardService.createBoard({name: this.boardName})
            .pipe(finalize(() => this.loaderService.dismissLoading()))
            .subscribe((response: Board) => {
                this.dismiss();
                this.toastService.presentToast('Доска упешно создана');
            }, (error) => {
                this.toastService.presentErrorToast();
            });
    }

}
