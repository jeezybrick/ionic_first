import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Column } from '../models/column.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  constructor(private http: HttpClient) {}

  public getColumns(boardId: string): Observable<Column[]> {
    return this.http.get<Column[]>(`/api/boards/${boardId}/columns`);
  }

  public createColumn(boardId: string, data: any): any {
    return this.http.post(`/api/boards/${boardId}/columns`, data);
  }

  public deleteColumn(columnId): any {
    return this.http.delete(`/api/columns/${columnId}`);
  }

}
