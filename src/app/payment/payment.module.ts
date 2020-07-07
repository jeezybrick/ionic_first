import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentMyComponent } from './components/payment-my/payment-my.component';
import { TwilioMyComponent } from './components/twilio-my/twilio-my.component';

@NgModule({
  declarations: [PaymentMyComponent, TwilioMyComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaymentRoutingModule,
  ]
})
export class PaymentModule { }
