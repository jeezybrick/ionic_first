import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ProfileRoutingModule } from './profile-routing.module';
import { SettingsComponent } from './components/settings/settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    FileUploadModule,
    IonicModule,
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
  ]
})
export class ProfileModule { }
