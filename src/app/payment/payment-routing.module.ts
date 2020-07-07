import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentMyComponent } from './components/payment-my/payment-my.component';


const routes: Routes = [
  { path: '', redirectTo: 'my', pathMatch: 'full' },
  {
    path: 'my',
    component: PaymentMyComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
