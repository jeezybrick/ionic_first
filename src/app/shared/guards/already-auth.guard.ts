import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorage } from '../services/token.storage';

@Injectable({
  providedIn: 'root'
})
export class AlreadyAuthGuard implements CanActivate {

  constructor(public router: Router, private token: TokenStorage) {}

    canActivate() {
      const user = this.token.getToken();
      return !user;
  }
}
