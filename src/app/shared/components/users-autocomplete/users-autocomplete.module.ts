import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UsersAutocompleteComponent } from './users-autocomplete.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [UsersAutocompleteComponent],
    exports: [UsersAutocompleteComponent],
    imports: [IonicModule, CommonModule],
})
export class UsersAutocompleteModule {}
