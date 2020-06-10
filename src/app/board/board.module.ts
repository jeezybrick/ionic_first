import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { BoardRoutingModule } from './board-routing.module';
import { BoardsListComponent } from './components/boards-list/boards-list.component';
import { CardsListComponent } from './components/cards-list/cards-list.component';
import { CreateBoardModalComponent } from './components/create-board-modal/create-board-modal.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BoardsListComponent, CardsListComponent, CreateBoardModalComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BoardRoutingModule
  ]
})
export class BoardModule { }
