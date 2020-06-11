import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardsListComponent } from './components/boards-list/boards-list.component';
import { ColumnsListComponent } from './components/columns-list/columns-list.component';
import { CardsListComponent } from './components/cards-list/cards-list.component';

const routes: Routes = [
  {
    path: '',
    component: BoardsListComponent,
  },
  {
    path: ':boardId',
    children: [
      { path: '', redirectTo: 'columns', pathMatch: 'full' },
      {
        path: 'columns',
        children: [
          { path: '', component: ColumnsListComponent, },
          {
            path: ':columnId',
            children: [
              { path: '', redirectTo: 'cards', pathMatch: 'full' },
              {
                path: 'cards',
                children: [
                  { path: '', component: CardsListComponent, },
                ],
              }
            ],
          }
        ],
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardRoutingModule { }
