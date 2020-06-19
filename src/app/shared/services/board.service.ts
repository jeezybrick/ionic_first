import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, tap } from 'rxjs/operators';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { Board } from '../models/board.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { TokenStorage } from './token.storage';

@Injectable({
    providedIn: 'root'
})
export class BoardService {
    private boards: Board[] = [];
    private pollingInviteToBoard$: Subject<boolean> = new Subject();
    private pollingInviteToBoardSubscription: Subscription;
    private pollingInviteToBoardInterval: number = 15 * 1000;

    constructor(private http: HttpClient, private tokenStorage: TokenStorage) {
    }

    public getBoards(sortBy = 'createdAt', sortDirection = '1'): any {
        return this.http.get<Board[]>('/api/boards', {params: {sortBy, sortDirection}}).pipe(
            tap((boards: Board[]) => {
                this.boards = boards;
            })
        );
    }

    public getBoardDetail(boardId: string): Observable<Board> {
        return this.http.get<Board>(`/api/boards/${boardId}`);
    }

    public createBoard(data: { name: string; users?: string[] }): any {
        return this.http.post('/api/boards', data).pipe(
            tap((board: Board) => {
                this.boards.push(board);
            })
        );
    }

    public deleteBoard(boardId): any {
        return this.http.delete(`/api/boards/${boardId}`).pipe(
            tap((data: any) => {
                const index = this.boards.findIndex((item) => item._id === boardId);

                if (index > -1) {
                    this.boards.splice(index, 1);
                }
            })
        );
    }

    public addUsersToBoard(boardId: string, ids: string[]): Observable<User[]> {
        return this.http.post<User[]>(`/api/boards/${boardId}/add-users`, {users: ids});
    }

    public removeUsersFromBoard(boardId: string, ids: string[]): Observable<User[]> {
        return this.http.post<User[]>(`/api/boards/${boardId}/remove-users`, {users: ids});
    }

    public startPollingInviteToBoard(): Observable<boolean> {
        this.stopPollingInviteToBoard();

        if (!!this.tokenStorage.getToken()) {
            this.pollingInviteToBoardSubscription = timer(0, this.pollingInviteToBoardInterval).subscribe((res) => {
                this.http.get<boolean>('/api/boards/checkIsNotified').pipe(
                    filter(value => !value),
                ).subscribe((value) => {
                    this.pollingInviteToBoard$.next(value);
                });
            });
        }


        return this.pollingInviteToBoard$.asObservable();
    }

    public stopPollingInviteToBoard(): void {

        if (this.pollingInviteToBoardSubscription) {
            this.pollingInviteToBoardSubscription.unsubscribe();
            this.pollingInviteToBoard$.complete();
        }

    }

}
