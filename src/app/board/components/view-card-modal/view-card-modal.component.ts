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
import { finalize } from 'rxjs/operators';
import { Note } from '../../../shared/models/note.model';

@Component({
    selector: 'app-view-card-modal',
    templateUrl: './view-card-modal.component.html',
    styleUrls: ['./view-card-modal.component.scss'],
})
export class ViewCardModalComponent implements OnInit, OnDestroy {
    public noteText = '';
    public currentUser$: Observable<User>;
    private subs = new SubSink();
    private toggleIsFavoriteStateSubscription: Subscription;

    @Input() card: Card;

    constructor(private modalController: ModalController,
                private authService: AuthService,
                private toastService: ToastService,
                private cardService: CardService,
                private noteService: NoteService,
                private loaderService: LoaderService) {
    }

    ngOnInit() {
        this.currentUser$ = this.authService.getUser();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    public dismiss(data?) {
        this.modalController.dismiss(data);
    }

    public async addNote() {
        await this.loaderService.presentLoading('Добавление...');

        this.subs.sink = this.noteService.createNote(this.card._id, {name: this.noteText})
            .pipe(finalize(() => this.loaderService.dismissLoading()))
            .subscribe((response: Note) => {
                this.clearNoteText();
                this.card.notes.push(response);
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
            .subscribe((response: Note) => {
                    this.toastService.presentToast('Заметка упешно удалена');
                    this.card.notes = this.card.notes.filter(item => item._id !== response._id);
                },
                (error) => {
                    this.toastService.presentErrorToast();
                });
    }

    public toggleIsFavoriteState(note: Note) {
        note.favorite = !note.favorite;
        if (this.toggleIsFavoriteStateSubscription) {
            this.toggleIsFavoriteStateSubscription.unsubscribe();
        }

        this.toggleIsFavoriteStateSubscription = this.subs.sink =
            this.noteService.updateNote(note._id, {favorite: note.favorite})
                .subscribe();
    }

    private clearNoteText(): void {
        this.noteText = '';
    }

}
