import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { User } from '../../models/user.model';
import { SubSink } from 'subsink';
import { IonSearchbar } from '@ionic/angular';
import { Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-autocomplete',
  templateUrl: './users-autocomplete.component.html',
  styleUrls: ['./users-autocomplete.component.scss']
})
export class UsersAutocompleteComponent implements OnChanges, OnDestroy, AfterViewInit {
  public users: User[] = [];
  public filteredUsers = [];
  public isUsersLoading: boolean = false;
  public isUsersLoaded: boolean = false;
  public searchInputFocused: boolean = false;
  private subs = new SubSink();

  @Input() selectedUsers: User[] = [];
  @Input() placeholder: string = 'Добавить пользователя к доске';
  @Output() userSelected: EventEmitter<User> = new EventEmitter<User>();
  @ViewChild('searchInput') searchInput: IonSearchbar;

  constructor(private router: Router,
              private boardService: BoardService,
              private toastService: ToastService,
              private userService: UserService) {
  }

  ngOnChanges(changes) {
    if (changes.selectedUsers && !changes.selectedUsers.isFirstChange()) {
      this.searchUsers();
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngAfterViewInit() {
    this.searchUsers();
  }

  public searchUsers(value: string = this.searchInput.value || ''): void {
    const users = [...this.users].filter(user => !this.selectedUsers.find(item => item._id === user._id));
    if (!value.length) {
      this.filteredUsers = users;
    }

    this.filteredUsers = users.filter(option => option.fullname.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  public selectUser(user): void {
    this.userSelected.emit(user);
    this.searchInput.value = '';
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

}
