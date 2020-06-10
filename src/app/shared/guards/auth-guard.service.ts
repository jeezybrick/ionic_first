import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorage } from '../services/token.storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public router: Router, private token: TokenStorage) {}

    canActivate() {
      const user = this.token.getToken();
      if (user) { return true; }

      // not logged in so redirect to login page with the return url
      this.router.navigate(['/auth']);
      return false;
  }
}
