import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { BoardRoutingModule } from './board-routing.module';
import { BoardsListComponent } from './components/boards-list/boards-list.component';
import { CardsListComponent } from './components/cards-list/cards-list.component';
import { CreateBoardModalComponent } from './components/create-board-modal/create-board-modal.component';
import { FormsModule } from '@angular/forms';
import { ColumnsListComponent } from './components/columns-list/columns-list.component';
import { CreateColumnModalComponent } from './components/create-column-modal/create-column-modal.component';
import { CreateCardModalComponent } from './components/create-card-modal/create-card-modal.component';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { UsersAutocompleteModule } from '../shared/components/users-autocomplete/users-autocomplete.module';
import { AddUserToBoardModalComponent } from './components/add-user-to-board-modal/add-user-to-board-modal.component';

@NgModule({
  declarations: [
      BoardsListComponent,
    CardsListComponent,
    CreateBoardModalComponent,
    ColumnsListComponent,
    CreateColumnModalComponent,
    CreateCardModalComponent,
    AddUserToBoardModalComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BoardRoutingModule,
    AutoCompleteModule,
    UsersAutocompleteModule,
  ]
})
export class BoardModule { }
