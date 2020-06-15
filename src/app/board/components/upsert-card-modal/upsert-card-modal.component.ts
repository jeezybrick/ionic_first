import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { ModalController } from '@ionic/angular';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { finalize, map } from 'rxjs/operators';
import { CardPrioritiesEnum, CardPrioritiesInterface, CardService, cardPriorities } from '../../../shared/services/card.service';
import { Card } from '../../../shared/models/card.model';

@Component({
  selector: 'app-upsert-card-modal',
  templateUrl: './upsert-card-modal.component.html',
  styleUrls: ['./upsert-card-modal.component.scss'],
})
export class UpsertCardModalComponent implements OnInit, OnDestroy {
  public cardName = '';
  public selectedUsers = [];
  public cardPriorities: CardPrioritiesInterface[] = [...cardPriorities];
  public cardPriority: CardPrioritiesEnum;
  private subs = new SubSink();

  @Input() columnId: string;
  @Input() isEdit: boolean = false;
  @Input() card: Card;

  constructor(public modalController: ModalController,
              private toastService: ToastService,
              private cardService: CardService,
              private loaderService: LoaderService) {}

  ngOnInit() {
    this.cardPriority = this.cardPriorities[0].value;
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
    const data = {
      name: this.cardName,
      priority: this.cardPriority,
      users: this.selectedUsers.map(item => item._id),
    };

    this.subs.sink = this.cardService.createCard(this.columnId, data)
        .pipe(
            finalize(() => this.loaderService.dismissLoading()),
            map((card: Card) => {
              const priorityName: string = cardPriorities.find(option => option.value === card.priority).name;
              return {...card, priorityName };
            })
        )
        .subscribe((response: Card) => {
          this.dismiss({createdCard: response});
          this.toastService.presentToast('Карточка упешно создана');
        }, (error) => {
          this.toastService.presentErrorToast();
        });
  }
}