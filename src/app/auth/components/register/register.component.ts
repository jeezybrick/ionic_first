import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../shared/services/loader.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public userForm: FormGroup;
  public error = null;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private loaderService: LoaderService,
              private router: Router) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      fullname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator])
    });
  }

  get fullname(): FormControl {
    return this.userForm.get('fullname') as FormControl;
  }

  get email(): FormControl {
    return this.userForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.userForm.get('password') as FormControl;
  }

  get repeatPassword(): FormControl {
    return this.userForm.get('repeatPassword') as FormControl;
  }

  public async register() {

    if (!this.userForm.valid) {
      return;
    }

    await this.loaderService.presentLoading('Регистарция...');

    const {
      fullname,
      email,
      password,
      repeatPassword
    } = this.userForm.getRawValue();


    // отправка данніх на бекенд
    this.authService.register(fullname, email, password, repeatPassword)
        .pipe(
            finalize(() => this.loaderService.dismissLoading())
        )
        .subscribe(data => {
          this.router.navigate(['']);
        }, (error) => {
          this.error = error;
        });
  }

  private passwordsMatchValidator(control: FormControl): ValidationErrors {
    const password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    } : null;
  }

}
