import { Component, OnInit, ViewChild } from '@angular/core';
import { IonReorderGroup, ModalController, ToastController } from '@ionic/angular';
import { Board } from '../../../shared/models/board.model';
import { BoardService } from '../../../shared/services/board.service';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss'],
})
export class BoardsListComponent implements OnInit {
  public boards: Board[] = [];
  public isBoardsListLoading = true;
  public isBoardsDeleteProcess = false;

  constructor(
      private modalController: ModalController,
      private boardService: BoardService,
      private toastController: ToastController) {}

  ngOnInit() {
    this.getBoardList();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModallPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Что-то пошло не так :(',
      duration: 5000,
      color: 'danger'
    });
    toast.present();
  }

  private getBoardList(): void {
    this.boardService.getBoards()
        .subscribe((response: Board[]) => {
              this.boards = response;
              this.isBoardsListLoading = false;
            },
            (error) => {
              this.presentToast();
            });

  }
}

@Component({
  selector: 'app-modal-page',
  template: `
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>Добавить карточку</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="dismiss()">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content fullscreen>
          </ion-content>
        `,
})
export class ModallPage {

  constructor(public modalController: ModalController) {

  }

  public dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
