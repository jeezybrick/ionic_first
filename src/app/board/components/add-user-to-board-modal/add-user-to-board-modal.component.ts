import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Board } from '../../../shared/models/board.model';
import { SubSink } from 'subsink';
import { ModalController } from '@ionic/angular';
import { BoardService } from '../../../shared/services/board.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { finalize } from 'rxjs/operators';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-add-user-to-board-modal',
  templateUrl: './add-user-to-board-modal.component.html',
  styleUrls: ['./add-user-to-board-modal.component.scss'],
})
export class AddUserToBoardModalComponent implements OnInit, OnDestroy {
  public selectedUsers = [];
  private subs = new SubSink();

  @Input() board: Board;

  constructor(public modalController: ModalController,
              private boardService: BoardService,
              private toastService: ToastService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get excludedUsers(): User[] {
    return [...this.board.users, ...this.selectedUsers];
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

    this.subs.sink = this.boardService.addUsersToBoard(this.board._id, this.selectedUsers.map(item => item._id))
        .pipe(finalize(() => this.loaderService.dismissLoading()))
        .subscribe((response: User[]) => {
          this.dismiss(response);
          this.toastService.presentToast('Пользователи упешно добавлены');
        }, (error) => {
          this.toastService.presentErrorToast();
        });
  }
}
