import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../models/card.model';
import { User } from '../models/user.model';
import { CardLogTimeSubmitDataInterface, CardLogTimeSuffixType } from '../interfaces/card-log-time-submit-data.interface';
import { CardEstimateTimeSubmitDataInterface } from '../interfaces/card-estimate-time-submit-data.interface';

export interface UpdateCardPositionInterface {
    currentColumnId: string;
    previousColumnId: string;
    currentIndex: number;
    previousIndex: number;
    cardId: string;
}

export enum CardPrioritiesEnum {
    NO = '',
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export interface CardPrioritiesInterface {
    name: string;
    value: CardPrioritiesEnum;
}

export const cardPriorities: CardPrioritiesInterface[] = [
    {
        name: 'Без приорітету',
        value: CardPrioritiesEnum.NO,
    },
    {
        name: 'Низький',
        value: CardPrioritiesEnum.LOW,
    },
    {
        name: 'Середній',
        value: CardPrioritiesEnum.MEDIUM,
    },
    {
        name: 'Високий',
        value: CardPrioritiesEnum.HIGH,
    },
];

export const logTimeValues: { value: CardLogTimeSuffixType; viewValue: string; }[] = [
    {
        value: 'm',
        viewValue: 'Минут',
    },
    {
        value: 'h',
        viewValue: 'Часов',
    },
];

@Injectable({
    providedIn: 'root'
})
export class CardService {

    constructor(private http: HttpClient) {
    }

    public getAllCards(columnId): Observable<Card[]> {
        return this.http.get<Card[]>(`/api/columns/${columnId}/cards`);
    }

    public createCard(columnId: string, data: any): any {
        return this.http.post(`/api/columns/${columnId}/cards`, data);
    }

    public updatePosition(data: UpdateCardPositionInterface): any {
        return this.http.patch(`/api/cards/${data.cardId}/update-position`, data);
    }

    public deleteCard(cardId): any {
        return this.http.delete(`/api/cards/${cardId}`);
    }

    public updateCard(cardId, data): Observable<Card> {
        return this.http.patch<Card>(`/api/cards/${cardId}`, data);
    }

    public addUsersToCard(cardId: string, ids: string[]): Observable<Card> {
        return this.http.post<Card>(`/api/cards/${cardId}/add-users`, {users: ids});
    }

    public removeUsersFromCard(cardId: string, ids: string[]): Observable<Card> {
        return this.http.post<Card>(`/api/cards/${cardId}/remove-users`, {users: ids});
    }

    public logTime(cardId: string, data: CardLogTimeSubmitDataInterface): Observable<Card> {
        return this.http.post<Card>(`/api/cards/${cardId}/log-time`, data);
    }

    public estimateTime(cardId: string, data: CardEstimateTimeSubmitDataInterface): Observable<Card> {
        return this.http.post<Card>(`/api/cards/${cardId}/estimate-time`, data);
    }

}
