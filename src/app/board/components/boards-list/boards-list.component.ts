import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Board } from '../../../shared/models/board.model';
import { BoardService } from '../../../shared/services/board.service';
import { CreateBoardModalComponent } from '../create-board-modal/create-board-modal.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss'],
})
export class BoardsListComponent implements OnInit {
  public boards: Board[] = [];
  public isBoardsListLoading = true;

  constructor(
      private modalController: ModalController,
      private boardService: BoardService,
      private toastService: ToastService,
      private loaderService: LoaderService,) {}

  ngOnInit() {
    this.getBoardList();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CreateBoardModalComponent,
    });
    return await modal.present();
  }

  public async deleteBoard(event, boardId: string) {
    event.stopPropagation();
    event.preventDefault();
    await this.loaderService.presentLoading();

    this.boardService.deleteBoard(boardId)
        .pipe(finalize(() => this.loaderService.dismissLoading()))
        .subscribe((response: any) => {
          this.isBoardsListLoading = true;
          this.toastService.presentToast('Доска упешно удалена');
          this.getBoardList();
        },
          (error) => {
            this.toastService.presentErrorToast();
          });
  }

  private getBoardList(): void {
    this.boardService.getBoards()
        .subscribe((response: Board[]) => {
              this.boards = response;
              this.isBoardsListLoading = false;
            },
            (error) => {
              this.toastService.presentErrorToast();
            });

  }
}
