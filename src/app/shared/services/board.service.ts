import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, tap } from 'rxjs/operators';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { Board } from '../models/board.model';

@Injectable({
    providedIn: 'root'
})
export class BoardService {
    private boards: Board[] = [];
    private pollingInviteToBoard$: Subject<boolean> = new Subject();
    private pollingInviteToBoardSubscription: Subscription;
    private pollingInviteToBoardInterval: number = 15 * 1000;

    constructor(private http: HttpClient) {
    }

    public getBoards(sortBy = 'createdAt', sortDirection = '1'): any {
        return this.http.get<Board[]>('/api/boards', {params: {sortBy, sortDirection}}).pipe(
            tap((boards: Board[]) => {
                this.boards = boards;
            })
        );
    }

    public getBoardDetail(boardId): any {
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


    public startPollingInviteToBoard(): Observable<boolean> {
        this.stopPollingInviteToBoard();
        this.pollingInviteToBoardSubscription = timer(0, this.pollingInviteToBoardInterval).subscribe((res) => {
            this.http.get<boolean>('/api/boards/checkIsNotified').pipe(
                filter(value => !value),
            ).subscribe((value) => {
                this.pollingInviteToBoard$.next(value);
            });
        });

        return this.pollingInviteToBoard$.asObservable();
    }

    public stopPollingInviteToBoard(): void {

        if (this.pollingInviteToBoardSubscription) {
            this.pollingInviteToBoardSubscription.unsubscribe();
            this.pollingInviteToBoard$.complete();
        }

    }

}
