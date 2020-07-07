import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: '', redirectTo: '/tabs/boards', pathMatch: 'full' },
      {
        path: 'boards',
        loadChildren: () => import('../board/board.module').then(m => m.BoardModule)
      },
      {
        path: 'users',
        loadChildren: () => import('../user/user.module').then(m => m.UserModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'payment',
        loadChildren: () => import('../payment/payment.module').then(m => m.PaymentModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
