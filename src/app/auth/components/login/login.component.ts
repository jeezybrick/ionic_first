import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public error = null;
  public isFormSubmitting = false;
  public email: string = '';
  public password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {}

  public login(): void {
    this.error = null;
    this.isFormSubmitting = true;

    this.authService.login(this.email, this.password)
        .subscribe(data => {
          this.router.navigate(['']);
          this.isFormSubmitting = false;
        }, (error) => {
          this.error = error;
          this.isFormSubmitting = false;
        });
  }

}
