import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Subscription, timer } from 'rxjs';
import { Board } from '../models/board.model';

@Injectable({
    providedIn: 'root'
})
export class BoardService {
    private boards: Board[] = [];
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


    public startPollingInviteToBoard(): void {
        this.stopPollingInviteToBoard();
        this.pollingInviteToBoardSubscription = timer(0, this.pollingInviteToBoardInterval).subscribe((res) => {

        });

    }

    public stopPollingInviteToBoard(): void {

        if (this.pollingInviteToBoardSubscription) {
            this.pollingInviteToBoardSubscription.unsubscribe();
        }

    }

}
