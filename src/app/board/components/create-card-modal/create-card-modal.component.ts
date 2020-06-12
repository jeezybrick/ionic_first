import { Component, Input, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { ModalController } from '@ionic/angular';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { finalize } from 'rxjs/operators';
import { CardService } from '../../../shared/services/card.service';
import { Card } from '../../../shared/models/card.model';

@Component({
  selector: 'app-create-card-modal',
  templateUrl: './create-card-modal.component.html',
  styleUrls: ['./create-card-modal.component.scss'],
})
export class CreateCardModalComponent implements OnDestroy {
  public cardName = '';
  public selectedUsers = [];
  private subs = new SubSink();

  @Input() columnId: string;

  constructor(public modalController: ModalController,
              private toastService: ToastService,
              private cardService: CardService,
              private loaderService: LoaderService) {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public dismiss(data?) {
    this.modalController.dismiss(data);
  }

  public onUserSelected(selectedUser): void {
    this.selectedUsers = [...this.selectedUsers, selectedUser];
  }


  public removeSelectedUser(user): void {
    this.selectedUsers = this.selectedUsers.filter(item => item._id !== user._id);
  }

  public async createCard() {
    await this.loaderService.presentLoading('Cохранение...');

    this.subs.sink = this.cardService.createCard(this.columnId, {name: this.cardName, users: this.selectedUsers.map(item => item._id)})
        .pipe(finalize(() => this.loaderService.dismissLoading()))
        .subscribe((response: Card) => {
          this.dismiss({createdCard: response});
          this.toastService.presentToast('Карточка упешно создана');
        }, (error) => {
          this.toastService.presentErrorToast();
        });
  }
}
