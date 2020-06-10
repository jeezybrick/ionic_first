import { Component, OnInit } from '@angular/core';

const defaultAvatarUrl = 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  public users = [
    {
      name: 'Андрей Стаценко',
      avatar: defaultAvatarUrl,
    },
    {
      name: 'Анастасия Земляная',
      avatar: defaultAvatarUrl,
    },
  ];
  public filteredUsers = [...this.users];

  constructor() {}
  ngOnInit() {
  }

  public searchUsers(value: string): void {
    if (!value.length) {
      this.filteredUsers = [...this.users];
    }

    this.filteredUsers = this.users.filter(option => option.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

}
