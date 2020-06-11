import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BoardService } from '../../../shared/services/board.service';
import { Board } from '../../../shared/models/board.model';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SubSink } from 'subsink';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';

@Component({
    selector: 'app-create-board-modal',
    templateUrl: './create-board-modal.component.html',
    styleUrls: ['./create-board-modal.component.scss'],
})
export class CreateBoardModalComponent implements OnInit, OnDestroy {
    public boardName = '';
    public users: User[] = [];
    public filteredUsers = [];
    public selectedUsers = [];
    public isUsersLoading: boolean = false;
    public isUsersLoaded: boolean = false;
    public searchInputFocused: boolean = false;
    private subs = new SubSink();

    constructor(public modalController: ModalController,
                private router: Router,
                private boardService: BoardService,
                private toastService: ToastService,
                private userService: UserService,
                private loaderService: LoaderService) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    public dismiss() {
        this.modalController.dismiss();
    }

    public searchUsers(value: string): void {
        const users = [...this.users].filter(user => !this.selectedUsers.find(item => item._id === user._id));
        if (!value.length) {
            this.filteredUsers = users;
        }

        this.filteredUsers = users.filter(option => option.fullname.toLowerCase().indexOf(value.toLowerCase()) > -1);
    }

    public selectUser(user, search): void {
        this.selectedUsers.push(user);
        search.value = '';
        this.searchUsers(search.value);
    }

    public removeSelectedUser(user, search): void {
        this.selectedUsers = this.selectedUsers.filter(item => item._id !== user._id);
        this.searchUsers(search.value);
    }

    public onFocus(): void {
        this.searchInputFocused = true;

        if (this.isUsersLoaded || this.isUsersLoading) {
            return;
        }

        this.subs.sink = this.userService.getAllUsers().subscribe((users) => {
            this.users = users;
            this.filteredUsers = [...this.users];
            this.isUsersLoading = false;
            this.isUsersLoaded = true;
        });
    }

    public onBlur(): void {
        setTimeout(() => {
            this.searchInputFocused = false;
        });
    }

    public async createBoard() {
        await this.loaderService.presentLoading('Cохранение...');

        this.subs.sink = this.boardService.createBoard({name: this.boardName, users: this.selectedUsers.map(item => item._id)})
            .pipe(finalize(() => this.loaderService.dismissLoading()))
            .subscribe((response: Board) => {
                this.dismiss();
                this.toastService.presentToast('Доска упешно создана');
            }, (error) => {
                this.toastService.presentErrorToast();
            });
    }

}
