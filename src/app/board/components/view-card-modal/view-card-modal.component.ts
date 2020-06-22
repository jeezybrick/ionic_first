import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastService } from '../../../shared/services/toast.service';
import { CardService } from '../../../shared/services/card.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { Card } from '../../../shared/models/card.model';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { SubSink } from 'subsink';
import { NoteService } from '../../../shared/services/note.service';
import { finalize, tap } from 'rxjs/operators';
import { Note } from '../../../shared/models/note.model';
import { AddUserToCardModalComponent } from '../add-user-to-card-modal/add-user-to-card-modal.component';

@Component({
    selector: 'app-view-card-modal',
    templateUrl: './view-card-modal.component.html',
    styleUrls: ['./view-card-modal.component.scss'],
})
export class ViewCardModalComponent implements OnInit, OnDestroy {
    public noteText = '';
    public currentUser$: Observable<User>;
    public isFavorite: Map<string, boolean>;
    public segments: {value: string; viewValue: string; }[] = [
        {
            value: 'notes',
            viewValue: 'Заметки'
        },
        {
            value: 'actions',
            viewValue: 'Все действия'
        },
    ];
    public segment: 'notes' | 'actions' = 'notes';

    private toggleIsFavoriteStateSubscription: Subscription;
    private subs = new SubSink();

    @Input() card: Card;

    constructor(private modalController: ModalController,
                private authService: AuthService,
                private toastService: ToastService,
                private cardService: CardService,
                private noteService: NoteService,
                private loaderService: LoaderService) {
    }

    ngOnInit() {
        this.currentUser$ = this.authService.getUser().pipe(tap((currentUser) => {
            this.isFavorite = new Map<string, boolean>(this.card.notes.map(note => {
                const isFavorite = note.likes.find(item => item === currentUser._id);
                return [note._id, !!isFavorite];
            }));
        }));


    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    get loggedTimeSum() {
        const sumInMinutes = this.card.loggedTime.filter(item => item.suffix === 'm').reduce((acc: number, b: any) => acc + b.value, 0);
        const sumInHours = this.card.loggedTime.filter(item => item.suffix === 'h').reduce((acc: number, b: any) => acc + b.value, 0);
        return {
            valueM: sumInMinutes,
            valueH: sumInHours,
            suffixM: 'm',
            suffixH: 'h'
        };
    }

    public async addUsersToCard() {
        const modal = await this.modalController.create({
            component: AddUserToCardModalComponent,
            componentProps: {
                card: this.card,
            }
        });

        modal.onWillDismiss().then((res) => {
            if (res && res.data) {
                this.card = {...this.card, ...res.data};
            }
        });

        return await modal.present();
    }

    public dismiss(data = this.card) {
        this.modalController.dismiss(data);
    }

    public async addNote() {
        await this.loaderService.presentLoading('Добавление...');

        this.subs.sink = this.noteService.createNote(this.card._id, {name: this.noteText})
            .pipe(finalize(() => this.loaderService.dismissLoading()))
            .subscribe((response: Card) => {
                this.clearNoteText();
                this.card = {...this.card, ...response};
                this.toastService.presentToast('Заметка упешно добавлена');
            }, (error) => {
                this.toastService.presentErrorToast();
            });
    }

    public async deleteNote(event, noteId: string) {
        event.stopPropagation();
        event.preventDefault();
        await this.loaderService.presentLoading('Удаление...');

        this.subs.sink = this.noteService.deleteNote(noteId)
            .pipe(finalize(() => this.loaderService.dismissLoading()))
            .subscribe((response: Card) => {
                    this.toastService.presentToast('Заметка упешно удалена');
                    this.card = {...this.card, ...response};
                },
                (error) => {
                    this.toastService.presentErrorToast();
                });
    }

    public toggleIsFavoriteState(note: Note) {
        let obs: Observable<Note>;
        this.isFavorite.set(note._id, !this.isFavorite.get(note._id));

        if (this.toggleIsFavoriteStateSubscription) {
            this.toggleIsFavoriteStateSubscription.unsubscribe();
        }

        if (this.isFavorite.get(note._id)) {
            obs =
                this.noteService.addLike(note._id);
        } else {
            if (!this.isFavorite.get(note._id)) {
                obs =
                    this.noteService.removeLike(note._id);
            }
        }

        this.toggleIsFavoriteStateSubscription = this.subs.sink = obs.subscribe();

    }

    public async removeUserFromCard(event, user: User) {
        event.stopPropagation();
        event.preventDefault();
        await this.loaderService.presentLoading('Удаление...');

        this.subs.sink = this.cardService.removeUsersFromCard(this.card._id, [user._id])
            .pipe(finalize(() => this.loaderService.dismissLoading()))
            .subscribe((response: Card) => {
                    this.toastService.presentToast('Пользователь успешно удален с карточки');
                    this.card = {...this.card, ...response};
                },
                (error) => {
                    this.toastService.presentErrorToast();
                });
    }

    public segmentChanged(ev: any) {
        this.segment = ev.detail.value;
    }

    private clearNoteText(): void {
        this.noteText = '';
    }

}
