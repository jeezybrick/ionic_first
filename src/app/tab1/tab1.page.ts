import { Component, ViewChild } from '@angular/core';
import { IonReorderGroup, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  constructor(public modalController: ModalController) {

  }

  doReorder(ev: any) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
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
export class ModalPage {

  constructor(public modalController: ModalController) {

  }

  public dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
