import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardsListComponent } from './components/boards-list/boards-list.component';
import { CardsListComponent } from './components/cards-list/cards-list.component';

const routes: Routes = [
  {
    path: '',
    component: BoardsListComponent,
  },
  {
    path: ':boardId/cards',
    component: CardsListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardRoutingModule { }
