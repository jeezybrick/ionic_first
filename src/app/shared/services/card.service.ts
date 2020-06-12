import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
        name: 'Без приоритета',
        value: CardPrioritiesEnum.NO,
    },
    {
        name: 'Низкий',
        value: CardPrioritiesEnum.LOW,
    },
    {
        name: 'Средний',
        value: CardPrioritiesEnum.MEDIUM,
    },
    {
        name: 'Высокий',
        value: CardPrioritiesEnum.HIGH,
    },
];

@Injectable({
    providedIn: 'root'
})
export class CardService {

    constructor(private http: HttpClient) {
    }

    public getAllCards(columnId): any {
        return this.http.get(`/api/columns/${columnId}/cards`);
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

    public updateCard(cardId, data): Observable<any> {
        return this.http.patch(`/api/cards/${cardId}`, data);
    }

}
