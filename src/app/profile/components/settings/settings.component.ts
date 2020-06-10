import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../shared/models/user.model';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public errors = null;
  public user: User;
  public profileForm: FormGroup;
  public isUserLoading = true;

  constructor(private authService: AuthService,
              private loaderService: LoaderService,
              private toastService: ToastService,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.authService.me().subscribe((data: any) => {
      this.user = data.user;

      this.setProfileForm();
      this.isUserLoading = false;
    });
  }

  public logout(): void {
    this.authService.signOut();
    this.router.navigate(['/auth/login']);
  }

  public async onSubmit({value, invalid}: any) {

    if (invalid) {
      return;
    }

    this.errors = null;
    await this.loaderService.presentLoading();

    this.authService.updateProfile(value)
        .pipe(
            finalize(() => this.loaderService.dismissLoading())
        )
        .subscribe((response: any) => {
              this.toastService.presentToast('Профіль успішно відредагований');
            },
            (error) => {
              this.toastService.presentErrorToast();
              this.errors = error;
            });
  }

  private setProfileForm(): void {
    this.profileForm = this.fb.group({
      fullname: [this.user.fullname , [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: [this.user.email , [Validators.email, Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      // password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

}
