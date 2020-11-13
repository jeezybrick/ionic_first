import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { BoardService } from './board.service';
import { TokenStorage } from './token.storage';
import { filter, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public $userSource: Subject<any> = new BehaviorSubject(null);
    public user: User;

    constructor(private socket: Socket, private http: HttpClient, private token: TokenStorage, private boardService: BoardService) {
        if(this.token.getToken()) {
            this.me().subscribe((data) => {
                this.user = data.user;
                this.socket.emit('set-id', data.user._id);
            });
        }
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post('/api/auth/login', {
            email,
            password
        }).pipe(
            tap(data => {
                this.setUser(data.user);
                this.token.saveToken(data.token);
                this.boardService.getBoards().subscribe();
                this.boardService.startPollingInviteToBoard();
            }),
        );
    }

    register(fullname: string, email: string, password: string, repeatPassword: string): Observable<any> {
      return this.http.post('/api/auth/register', {
        fullname,
        email,
        password,
        repeatPassword
      }).pipe(
          tap(data => {
            this.setUser(data.user);
            this.token.saveToken(data.token);
          }),
      );
    }

    setUser(user): void {
        this.$userSource.next(user);
    }

    getUser(): Observable<any> {
        return this.$userSource.asObservable().pipe(filter(item => !!item));
    }

    updateProfile(data): Observable<any> {
        return this.http.patch(`/api/user/edit`, data).pipe(
            tap(user => {
                this.setUser(user);
            }),
        );
    }

    uploadAvatar(file: File): Observable<boolean> {
        const formData = new FormData();
        formData.append('avatar', file, file.name);

        return this.http.post<boolean>(`/api/users/${this.user._id}/upload-avatar`, formData);

    }

    me(): Observable<any> {
        return this.http.get('/api/auth/me').pipe(
            tap(data => {
                this.setUser(data.user);
            }),
        );
    }

    signOut(): void {
        this.token.signOut();
        this.setUser(null);
        this.user = null;
        this.boardService.stopPollingInviteToBoard();
    }
}
