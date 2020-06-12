import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../shared/services/auth.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { CreateCardModalComponent } from '../create-card-modal/create-card-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../../shared/models/card.model';
import { delay, finalize } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { CardService, UpdateCardPositionInterface } from '../../../shared/services/card.service';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss'],
})
export class CardsListComponent implements OnInit, OnDestroy {
  public cards: Card[] = [];
  public currentUser$: Observable<User>;
  public isCardsLoading = true;
  public currentUserId: string;
  public columnId: string;
  private subs = new SubSink();

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private modalController: ModalController,
      private cardService: CardService,
      private toastService: ToastService,
      private authService: AuthService,
      private actionSheetController: ActionSheetController,
      private loaderService: LoaderService) {}

  ngOnInit() {
    this.currentUser$ = this.authService.getUser();
    this.subs.sink = this.authService.getUser().subscribe(currentUser => this.currentUserId = currentUser._id);
    this.subs.sink = this.route.params.subscribe((params) => {
      this.columnId = params.columnId;

      if (!this.columnId) {
        this.router.navigate(['boards']);
        return;
      }

      this.getCards(params.columnId);

    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public doReorder(ev: any) {

    const data: UpdateCardPositionInterface = {
      currentColumnId: this.columnId,
      previousColumnId: this.columnId,
      currentIndex: ev.detail.to,
      previousIndex: ev.detail.from,
      cardId: this.cards[ev.detail.from]._id,
    };
    this.subs.sink = this.cardService.updatePosition(data).subscribe((res) => {
      console.log(res);
    });
    ev.detail.complete();
    console.log(this.cards);
  }

  public reloadData(event): void {
    this.getCards(this.columnId, event);
  }

  async addCard() {
    const modal = await this.modalController.create({
      component: CreateCardModalComponent,
      componentProps: {
        columnId: this.route.snapshot.params.columnId,
      },
    });

    modal.onWillDismiss().then((res) => {
      if (res && res.data) {
        this.cards = [...this.cards, res.data.createdCard];
      }
    });

    return await modal.present();
  }

  async presentActionSheet(event, cardId: string) {
    event.stopPropagation();
    event.preventDefault();

    const actionSheet = await this.actionSheetController.create({
      header: 'Карточки',
      buttons: [{
        text: 'Удалить',
        role: 'destructive',
        handler: () => {
          this.removeCard(cardId);
        }
      }, {
        text: 'Отмена',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  private async removeCard(cardId: string) {
    await this.loaderService.presentLoading('Удаление...');

    this.subs.sink = this.cardService.deleteCard(cardId)
        .pipe(finalize(() => this.loaderService.dismissLoading()))
        .subscribe((response: Card[]) => {

              const index = this.cards.findIndex((item) => item._id === cardId);

              if (index > -1) {
                this.toastService.presentToast('Карточка упешно удалена');
                this.cards.splice(index, 1);
              }
            },
            (error) => {
              this.toastService.presentErrorToast();
            });
  }

  private getCards(columnId, event?): void {
    this.subs.sink = this.cardService.getAllCards(columnId)
        .pipe(
            delay(1000)
        )
        .subscribe((response: Card[]) => {
      this.cards = response;
      this.isCardsLoading = false;

      if (event) {
        event.target.complete();
      }
    }, (error) => {
      this.toastService.presentErrorToast();
    });
  }

}
