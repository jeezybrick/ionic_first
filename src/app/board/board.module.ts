import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { BoardRoutingModule } from './board-routing.module';
import { BoardsListComponent, ModallPage } from './components/boards-list/boards-list.component';
import { CardsListComponent } from './components/cards-list/cards-list.component';

@NgModule({
  declarations: [BoardsListComponent, ModallPage, CardsListComponent],
  imports: [
    IonicModule,
    CommonModule,
    BoardRoutingModule
  ]
})
export class BoardModule { }
