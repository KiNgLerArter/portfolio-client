import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_LOADER } from '@services/api/api.service';
import { WebSocketService } from '@services/web-socket/web-socket.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Chat, chatDtos } from '../../chat/@types/chat.model';

@Injectable()
export class ChatsService extends WebSocketService {
  userChats$ = new BehaviorSubject<Chat[]>([]);
  selectedChatId$ = new BehaviorSubject<string>(null);

  constructor(protected http: HttpClient) {
    super(http, 'chats');
  }

  getUserChats(userId: number): Observable<Chat[]> {
    return this.get<Chat[]>(`${userId}/chats`, {
      rootUrl: 'users',
      context: new HttpContext().set(IS_LOADER, false),
    }).pipe(
      tap((chats) => {
        console.log('[chats]:', chats);
        this.userChats$.next(chats);
      }),
      catchError((error) => {
        console.log('[getUserChats error]:', error);
        return of([]);
      })
    );
  }

  createChat(dto: chatDtos.Create): Observable<Chat> {
    return this.post<Chat>('create', { body: dto }).pipe(
      tap((chat) => {
        console.log('[created chat]:', chat);

        const chats = this.userChats$.value;
        chats.push(chat);
        this.userChats$.next(chats);

        this.selectedChatId$.next(chat.id);
      }),
      catchError((error) => {
        console.log('[createChat error]:', error);
        return of(null);
      })
    );
  }
}
