import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ProfileRoutingModule } from './profile-routing.module';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    IonicModule,
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
