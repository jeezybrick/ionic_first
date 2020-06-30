import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../shared/services/loader.service';
import { finalize } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  public error = null;
  private subs = new SubSink();

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private loaderService: LoaderService,
              private router: Router) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator])
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get fullname(): FormControl {
    return this.registerForm.get('fullname') as FormControl;
  }

  get email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  get repeatPassword(): FormControl {
    return this.registerForm.get('repeatPassword') as FormControl;
  }

  public async register() {

    if (!this.registerForm.valid) {
      return;
    }

    await this.loaderService.presentLoading('Регистарция...');

    const {
      fullname,
      email,
      password,
      repeatPassword
    } = this.registerForm.getRawValue();


    // отправка данніх на бекенд
    this.subs.sink = this.authService.register(fullname, email, password, repeatPassword)
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
