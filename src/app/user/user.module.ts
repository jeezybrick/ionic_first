import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { UserRoutingModule } from './user-routing.module';
import { UsersListComponent } from './components/users-list/users-list.component';

@NgModule({
  declarations: [UsersListComponent],
  imports: [
    IonicModule,
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
