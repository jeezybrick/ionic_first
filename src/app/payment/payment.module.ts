import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentMyComponent } from './components/payment-my/payment-my.component';
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [PaymentMyComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
      ReactiveFormsModule,
    PaymentRoutingModule,
    // NgxStripeModule.forChild(),
  ]
})
export class PaymentModule { }
