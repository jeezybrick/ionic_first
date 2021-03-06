import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Note } from '../models/note.model';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) {}

  public getAllNotes(): any {
    return this.http.get(`/api/notes`);
  }

  public getNotes(cardId: string): any {
    return this.http.get(`/api/cards/${cardId}/notes`);
  }

  public createNote(cardId: string, data: { name: string; }): Observable<Card> {
    return this.http.post<Card>(`/api/cards/${cardId}/notes`, data);
  }

  public deleteNote(noteId): Observable<Card> {
    return this.http.delete<Card>(`/api/notes/${noteId}`);
  }

  public addLike(noteId: string): Observable<Note> {
    return this.http.post<Note>(`/api/notes/${noteId}/add-like`, null);
  }

  public removeLike(noteId: string): Observable<Note> {
    return this.http.post<Note>(`/api/notes/${noteId}/remove-like`, null);
  }

}
