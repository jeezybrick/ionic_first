import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { BoardRoutingModule } from './board-routing.module';
import { BoardsListComponent } from './components/boards-list/boards-list.component';
import { CardsListComponent } from './components/cards-list/cards-list.component';
import { CreateBoardModalComponent } from './components/create-board-modal/create-board-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColumnsListComponent } from './components/columns-list/columns-list.component';
import { CreateColumnModalComponent } from './components/create-column-modal/create-column-modal.component';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { UsersAutocompleteModule } from '../shared/components/users-autocomplete/users-autocomplete.module';
import { AddUserToBoardModalComponent } from './components/add-user-to-board-modal/add-user-to-board-modal.component';
import { ViewCardModalComponent } from './components/view-card-modal/view-card-modal.component';
import { UpsertCardModalComponent } from './components/upsert-card-modal/upsert-card-modal.component';
import { AddUserToCardModalComponent } from './components/add-user-to-card-modal/add-user-to-card-modal.component';
import { CardLogTimeComponent } from './components/card-log-time/card-log-time.component';
import { CardAddEstimateTimeComponent } from './components/card-add-estimate-time/card-add-estimate-time.component';
import { CardMoveToColumnModalComponent } from './components/card-move-to-column-modal/card-move-to-column-modal.component';
import { BoardTypeInfoPopoverComponent } from './components/board-type-info-popover/board-type-info-popover.component';
import { ChooseBoardByTypeModalComponent } from './components/choose-board-by-type-modal/choose-board-by-type-modal.component';

@NgModule({
  declarations: [
      BoardsListComponent,
    CardsListComponent,
    CreateBoardModalComponent,
    ColumnsListComponent,
    CreateColumnModalComponent,
    AddUserToBoardModalComponent,
    ViewCardModalComponent,
    UpsertCardModalComponent,
    AddUserToCardModalComponent,
    CardLogTimeComponent,
    CardAddEstimateTimeComponent,
    CardMoveToColumnModalComponent,
    ChooseBoardByTypeModalComponent,
    BoardTypeInfoPopoverComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BoardRoutingModule,
    AutoCompleteModule,
    UsersAutocompleteModule,
  ]
})
export class BoardModule { }
