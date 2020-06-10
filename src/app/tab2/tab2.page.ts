import { Component } from '@angular/core';

const defaultAvatarUrl = 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public users = [
    {
      name: 'Андрей Стеценко',
      avatar: defaultAvatarUrl,
    },
    {
      name: 'Анастасия Земляная',
      avatar: defaultAvatarUrl,
    },
  ];
  public filteredUsers = [...this.users];

  constructor() {}

  public searchUsers(value: string): void {
    if (!value.length) {
      this.filteredUsers = [...this.users];
    }

    this.filteredUsers = this.users.filter(option => option.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

}
