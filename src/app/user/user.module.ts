import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { UserRoutingModule } from './user-routing.module';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

@NgModule({
  declarations: [UsersListComponent, UserDetailsComponent],
  imports: [
    IonicModule,
    CommonModule,
    UserRoutingModule,
  ]
})
export class UserModule { }
