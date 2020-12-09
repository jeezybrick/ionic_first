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
  public cardDescription = '';
  public selectedUsers = [];
  public cardPriorities: CardPrioritiesInterface[] = [...cardPriorities];
  public cardPriority: CardPrioritiesEnum;
  public headerText: string;
  public submitFormText: string;
  private subs = new SubSink();

  @Input() columnId: string;
  @Input() isEdit: boolean = false;
  @Input() card: Card;

  constructor(public modalController: ModalController,
              private toastService: ToastService,
              private cardService: CardService,
              private loaderService: LoaderService) {}

  ngOnInit() {
    if (this.isEdit) {
      this.cardName = this.card.name;
      this.cardDescription = this.card.description;
      this.selectedUsers = [...this.card.users];
      this.cardPriority = this.card.priority;
      this.headerText = 'Редагувати картку';
      this.submitFormText = 'Редагувати картку';
    }

    if (!this.isEdit) {
      this.cardPriority = this.cardPriorities[0].value;
      this.headerText = 'Додати картку';
      this.submitFormText = 'Створти картку';
    }

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

  public submitForm(): void {
    if (this.isEdit) {
      this.editCard();
    }

    if (!this.isEdit) {
      this.createCard();
    }
  }

  public async editCard() {
    await this.loaderService.presentLoading('Редактирование...');
    const data = {
      name: this.cardName,
      description: this.cardDescription,
      priority: this.cardPriority,
      users: this.selectedUsers.map(item => item._id),
    };

    this.subs.sink = this.cardService.updateCard(this.card._id, data)
        .pipe(
            finalize(() => this.loaderService.dismissLoading()),
            map((card: Card) => {
              const priorityName: string = cardPriorities.find(option => option.value === card.priority).name;
              return {...card, priorityName };
            })
        )
        .subscribe((response: Card) => {
          this.dismiss({card: response});
          this.toastService.presentToast('Картка успішно відредагована');
        }, (error) => {
          this.toastService.presentErrorToast();
        });
  }

  public async createCard() {
    await this.loaderService.presentLoading('Cохранение...');
    const data = {
      name: this.cardName,
      priority: this.cardPriority,
      description: this.cardDescription,
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
          this.dismiss({card: response});
          this.toastService.presentToast('Картка успішно створена');
        }, (error) => {
          this.toastService.presentErrorToast();
        });
  }
}
