import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../../shared/services/loader.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public error = null;
  public loginForm: FormGroup;
  private subs = new SubSink();

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private loaderService: LoaderService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  public async login() {
    this.error = null;
    await this.loaderService.presentLoading();
    const {email, password} = this.loginForm.value;

    this.subs.sink = this.authService.login(email, password)
        .pipe(
            finalize(() => this.loaderService.dismissLoading())
        )
        .subscribe(data => {
          this.router.navigate(['']);
        }, (error) => {
          this.error = error;
        });
  }

}
