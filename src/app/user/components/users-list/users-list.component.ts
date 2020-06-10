import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user.model';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  public users: User[] = [];
  public filteredUsers = [];
  public isUsersLoading: boolean = true;

  constructor(private userService: UserService) {}
  ngOnInit() {
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
      this.filteredUsers = [...this.users];
      this.isUsersLoading = false;
    });
  }

  public searchUsers(value: string): void {
    if (!value.length) {
      this.filteredUsers = [...this.users];
    }

    this.filteredUsers = this.users.filter(option => option.fullname.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

}
