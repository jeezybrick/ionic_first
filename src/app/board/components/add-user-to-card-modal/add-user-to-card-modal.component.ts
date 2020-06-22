import { Component, Input, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { ModalController } from '@ionic/angular';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { finalize } from 'rxjs/operators';
import { User } from '../../../shared/models/user.model';
import { Card } from '../../../shared/models/card.model';
import { CardService } from '../../../shared/services/card.service';

@Component({
  selector: 'app-add-user-to-card-modal',
  templateUrl: './add-user-to-card-modal.component.html',
  styleUrls: ['./add-user-to-card-modal.component.scss'],
})
export class AddUserToCardModalComponent implements OnDestroy {
  public selectedUsers = [];
  private subs = new SubSink();

  @Input() card: Card;

  constructor(public modalController: ModalController,
              private cardService: CardService,
              private toastService: ToastService,
              private loaderService: LoaderService) {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get excludedUsers(): User[] {
    return [...this.card.users, ...this.selectedUsers];
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

  public async submit() {
    await this.loaderService.presentLoading('Добавление...');

    this.subs.sink = this.cardService.addUsersToCard(this.card._id, this.selectedUsers.map(item => item._id))
        .pipe(finalize(() => this.loaderService.dismissLoading()))
        .subscribe((response: Card) => {
          this.dismiss(response);
          this.toastService.presentToast('Пользователи упешно добавлены');
        }, (error) => {
          this.toastService.presentErrorToast();
        });
  }
}
