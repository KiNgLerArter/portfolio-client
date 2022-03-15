import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebSocketService } from '@services/web-socket/web-socket.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Chat, chatDtos } from '../@types/chat.model';

@Injectable()
export class ChatsService extends WebSocketService {
  private _userChats$ = new BehaviorSubject<Chat[]>([]);

  selectedChat$ = new BehaviorSubject<Chat>(null);

  get userChats$(): Observable<Chat[]> {
    return this._userChats$.asObservable();
  }

  constructor(protected http: HttpClient) {
    super(http, 'chats');
  }

  getUserChats(userId: number): Observable<Chat[]> {
    return this.get<Chat[]>(`${userId}/chats`, { rootUrl: 'users' }).pipe(
      tap((chats) => {
        console.log('[chats]:', chats);
        this._userChats$.next(chats);
      }),
      catchError((error) => {
        console.log('[getUserChats error]:', error);
        return of([]);
      })
    );
  }

  createChat(dto: chatDtos.Create): Observable<Chat> {
    return this.post<Chat>('create', dto).pipe(
      tap((chat) => {
        console.log('[created chat]:', chat);

        const chats = this._userChats$.value;
        chats.push(chat);
        this._userChats$.next(chats);

        this.selectedChat$.next(chat);
      }),
      catchError((error) => {
        console.log('[createChat error]:', error);
        return of(null);
      })
    );
  }
}
