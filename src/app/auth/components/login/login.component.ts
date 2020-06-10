import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public error = null;
  public email: string = '';
  public password: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private loaderService: LoaderService) { }

  ngOnInit() {}

  public login(): void {
    this.error = null;
    this.loaderService.presentLoading();

    this.authService.login(this.email, this.password)
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
