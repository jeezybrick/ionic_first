import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UsersListComponent } from './components/users-list/users-list.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [UsersListComponent],
  imports: [
    IonicModule,
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
