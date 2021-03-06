import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../shared/services/auth.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Card } from '../../../shared/models/card.model';
import { delay, finalize, map, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { cardPriorities, CardService, UpdateCardPositionInterface } from '../../../shared/services/card.service';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { UpsertCardModalComponent } from '../upsert-card-modal/upsert-card-modal.component';
import { ViewCardModalComponent } from '../view-card-modal/view-card-modal.component';
import { CardLogTimeComponent } from '../card-log-time/card-log-time.component';
import { CardAddEstimateTimeComponent } from '../card-add-estimate-time/card-add-estimate-time.component';
import { CardMoveToColumnModalComponent } from '../card-move-to-column-modal/card-move-to-column-modal.component';
import { BoardService } from '../../../shared/services/board.service';
import { Board } from '../../../shared/models/board.model';
import { BoardTypes } from '../../../shared/enums/board-types.enum';
import { ColumnService } from '../../../shared/services/column.service';
import { Column } from '../../../shared/models/column.model';

@Component({
    selector: 'app-cards-list',
    templateUrl: './cards-list.component.html',
    styleUrls: ['./cards-list.component.scss'],
})
export class CardsListComponent implements OnInit, OnDestroy {
    public board: Board;
    public column: Column;
    public cards: Card[] = [];
    public currentUser$: Observable<User>;
    public isCardsLoading = true;
    public currentUserId: string;
    public columnId: string;
    public isReorderDisabled: boolean = true;
    public BoardTypes = BoardTypes;
    private params: Params;
    private subs = new SubSink();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private modalController: ModalController,
        private cardService: CardService,
        private toastService: ToastService,
        private boardService: BoardService,
        private columnService: ColumnService,
        private authService: AuthService,
        private actionSheetController: ActionSheetController,
        private loaderService: LoaderService) {
    }

    ngOnInit() {
        this.currentUser$ = this.authService.getUser();
        this.subs.sink = this.authService.getUser().subscribe(currentUser => this.currentUserId = currentUser._id);
        this.subs.sink = this.route.params
            .pipe(
                tap(params => this.params = params),
                switchMap(() => this.boardService.getBoardDetail(this.params.boardId)),
                tap(board =>  this.board = board),
                switchMap(board => this.columnService.getColumns(board._id)),
            )
            .subscribe(columns => {

                this.columnId = this.params.columnId;

                if (!this.columnId) {
                    this.router.navigate(['boards']);
                    return;
                }

                this.column = columns.find(column => column._id === this.columnId);
                this.getCards(this.columnId);

            });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    public get isShownAddCard(): boolean {
        return !this.isCardsLoading && (this.board.type === BoardTypes.Waterflow ? this.column.name === 'Резерв' : true);
    }

    public doReorder(ev: CustomEvent) {
        const cardsCountIndexes = this.cards.length - 1;
        const toIndex = ev.detail.to > cardsCountIndexes ? cardsCountIndexes : ev.detail.to;
        const fromIndex = ev.detail.from;

        const data: UpdateCardPositionInterface = {
            currentColumnId: this.columnId,
            previousColumnId: this.columnId,
            currentIndex: toIndex,
            previousIndex: fromIndex,
            cardId: this.cards[fromIndex]._id,
        };

        this.subs.sink = this.cardService.updatePosition(data)
            .pipe(
                map((cards: Card[]) => cards.map(item => {
                    const priorityName: string = cardPriorities.find(option => option.value === item.priority).name;
                    return {...item, priorityName};
                }))
            )
            .subscribe((res) => {
                this.cards = res;
            });
        ev.detail.complete();
    }

    public reloadData(event): void {
        this.getCards(this.columnId, event);
    }

    async addCard() {
        const modal = await this.modalController.create({
            component: UpsertCardModalComponent,
            componentProps: {
                columnId: this.route.snapshot.params.columnId,
            },
        });

        modal.onWillDismiss().then((res) => {
            if (res && res.data) {
                this.cards = [...this.cards, res.data.card];
            }
        });

        return await modal.present();
    }

    async viewCard(card: Card) {
        const modal = await this.modalController.create({
            component: ViewCardModalComponent,
            componentProps: {
                card,
            },
        });

        modal.onWillDismiss().then((res) => {
            if (res && res.data) {
                const index = this.cards.findIndex(item => item._id === res.data._id);

                if (index > -1) {
                    this.cards[index] = {...this.cards[index], ...res.data};
                }
            }
        });

        return await modal.present();
    }

    async editCard(card: Card) {
        const modal = await this.modalController.create({
            component: UpsertCardModalComponent,
            componentProps: {
                isEdit: true,
                card,
                columnId: card.columnId,
            },
        });

        modal.onWillDismiss().then((res) => {
            if (res && res.data) {
                const editedCard = res.data.card;
                const index = this.cards.findIndex(item => item._id === editedCard._id);

                if (index > -1) {
                    this.cards[index] = {...this.cards[index], ...editedCard};
                }
            }
        });

        return await modal.present();
    }

    async logTime(card: Card) {
        const modal = await this.modalController.create({
            component: CardLogTimeComponent,
            componentProps: {
                card,
            },
        });

        modal.onWillDismiss().then((res) => {
            if (res && res.data) {
                const editedCard = res.data;
                const index = this.cards.findIndex(item => item._id === editedCard._id);

                if (index > -1) {
                    this.cards[index] = {...this.cards[index], ...editedCard};
                }
            }
        });

        return await modal.present();
    }

    async addEstimate(card: Card) {
        const modal = await this.modalController.create({
            component: CardAddEstimateTimeComponent,
            componentProps: {
                card,
            },
        });

        modal.onWillDismiss().then((res) => {
            if (res && res.data) {
                const editedCard = res.data;
                const index = this.cards.findIndex(item => item._id === editedCard._id);

                if (index > -1) {
                    this.cards[index] = {...this.cards[index], ...editedCard};
                }
            }
        });

        return await modal.present();
    }

    async showMoveToColumnModal(card: Card) {
        const modal = await this.modalController.create({
            component: CardMoveToColumnModalComponent,
            componentProps: {
                card,
                boardType: this.board.type
            },
        });

        modal.onWillDismiss().then((res) => {
            if (res && res.data) {
                this.isCardsLoading = true;
                this.getCards();
            }
        });

        return await modal.present();
    }

    async presentActionSheet(event, card: Card) {
        event.stopPropagation();
        event.preventDefault();

        const actionSheet = await this.actionSheetController.create({
            header: 'Картки',
            buttons: [{
                text: 'Оцінка часу',
                handler: () => {
                    this.addEstimate(card);
                }
            }, {
                text: 'Врахувати час',
                handler: () => {
                    this.logTime(card);
                }
            }, {
                text: 'Перемістити у колонку',
                handler: () => {
                    this.showMoveToColumnModal(card);
                }
            }, {
                text: 'Переглянути',
                handler: () => {
                    this.viewCard(card);
                }
            }, {
                text: 'Редагувати',
                handler: () => {
                    this.editCard(card);
                }
            }, {
                text: 'Видалити',
                role: 'destructive',
                handler: () => {
                    this.removeCard(card._id);
                }
            }, {
                text: 'Відмінити',
                role: 'cancel'
            }]
        });
        await actionSheet.present();
    }

    public toggleReorder(): void {
        this.isReorderDisabled = !this.isReorderDisabled;
    }

    private async removeCard(cardId: string) {
        await this.loaderService.presentLoading('Удаление...');

        this.subs.sink = this.cardService.deleteCard(cardId)
            .pipe(finalize(() => this.loaderService.dismissLoading()))
            .subscribe((response: Card[]) => {
                    this.cards = response;
                    this.toastService.presentToast('Картка успішно видалена');
                },
                (error) => {
                    this.toastService.presentErrorToast();
                });
    }

    private getCards(columnId = this.columnId, event?): void {
        this.subs.sink = this.cardService.getAllCards(columnId)
            .pipe(
                delay(1000),
                map((cards: Card[]) => cards.map(item => {
                    const priorityName: string = cardPriorities.find(option => option.value === item.priority).name;
                    return {...item, priorityName};
                })),
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
