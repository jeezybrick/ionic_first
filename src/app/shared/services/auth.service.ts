import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { BoardService } from './board.service';
import { TokenStorage } from './token.storage';
import { filter } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public $userSource: Subject<any> = new BehaviorSubject(null);
  public user: User;

  constructor(private socket: Socket, private http: HttpClient, private token: TokenStorage, private boardService: BoardService) {
    this.me().subscribe((data) => {
      this.user = data.user;
      this.socket.emit('set-id', data.user._id);
    });
  }

  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post('/api/auth/login', {
        email,
        password
      }).subscribe((data: any) => {

        observer.next({user: data.user});
        this.setUser(data.user);
        this.token.saveToken(data.token);
        this.boardService.getBoards().subscribe();
        this.boardService.startPollingInviteToBoard();
        observer.complete();

      }, (error) => {
        observer.error({message: error.error.message, status: error.status});
        observer.complete();
      });
    });
  }

  register(fullname: string, email: string, password: string, repeatPassword: string): Observable<any> {
    return new Observable(observer => {
      this.http.post('/api/auth/register', {
        fullname,
        email,
        password,
        repeatPassword
      }).subscribe((data: any) => {

        observer.next({user: data.user});
        this.setUser(data.user);
        this.token.saveToken(data.token);
        observer.complete();
      }, (error) => {
        observer.error({message: error.error.message, status: error.status});
        observer.complete();
      });
    });
  }

  setUser(user): void {
    this.$userSource.next(user);
  }

  getUser(): Observable<any> {
    return this.$userSource.asObservable().pipe(filter(item => !!item));
  }

  updateProfile(data): Observable<any> {
    return new Observable(observer => {
      return this.http.patch(`/api/user/edit`, data).subscribe((user: any) => {
        observer.next(user);
        this.setUser(user);
        observer.complete();
      }, (error) => {
        observer.error(error.error);
        observer.complete();
      });
    });
  }

  me(): Observable<any> {
    return new Observable(observer => {
      const tokenVal = this.token.getToken();
      if (!tokenVal) {
        return observer.complete();
      }
      this.http.get('/api/auth/me').subscribe((data: any) => {
        observer.next({user: data.user});
        this.setUser(data.user);
        observer.complete();
      });
    });
  }

  signOut(): void {
    this.token.signOut();
    this.setUser(null);
    this.boardService.stopPollingInviteToBoard();

  }
}
