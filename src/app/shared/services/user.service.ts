import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';

const defaultAvatarUrl = 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').
    pipe(
        map(users => users.map(item => ({...item, avatar: defaultAvatarUrl})))
    );
  }

}
