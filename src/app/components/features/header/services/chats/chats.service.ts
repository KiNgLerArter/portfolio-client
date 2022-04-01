import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IS_LOADER } from '@services/api/api.service';
import { UsersService } from '@services/users/users.service';
import { WebSocketService } from '@services/web-socket/web-socket.service';
import { deepClone } from '@shared/utils';
import { formatInTimeZone } from 'date-fns-tz';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, pairwise, startWith, tap } from 'rxjs/operators';
import { chatDtos as dtos } from '../../@types/chat.dto';
import { Chat, Message } from '../../@types/chat.model';

@Injectable()
export class ChatsService extends WebSocketService {
  private _userChats$ = new BehaviorSubject<Chat[]>([]);

  currentChatId$ = new BehaviorSubject<string>(null);

  get userChats$(): Observable<Chat[]> {
    return this._userChats$.asObservable();
  }

  get currentChat(): Chat {
    return this._userChats.find(chat => chat.id === this.currentChatId$.value)
  }

  private get _userChats(): Chat[] {
    return deepClone(this._userChats$.value);
  }

  constructor(protected http: HttpClient, private usersService: UsersService) {
    super(http, 'chats');
    this._userChats$
      .pipe(
        pairwise(),
        tap(([prev, curr]) => {
          if (prev.length) {
            this.leaveChats(prev.map((chat) => chat.id));
          }

          this.joinChats(curr.map((chat) => chat.id));
        })
      )
      .subscribe();
  }

  //============HTTP============//

  getUserChats(userId: number): Observable<Chat[]> {
    return this.get<Chat[]>(`${userId}/chats`, {
      rootUrl: 'users',
      context: new HttpContext().set(IS_LOADER, false),
    }).pipe(
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

  createChat(dto: dtos.CreateChat): Observable<Chat> {
    return this.post<Chat>('create', { body: dto }).pipe(
      tap((chat) => {
        const chats = this._userChats$.value;
        chats.push(chat);
        this._userChats$.next(chats);

        this.currentChatId$.next(chat.id);
      }),
      catchError((error) => {
        console.log('[createChat error]:', error);
        return of(null);
      })
    );
  }

  //============WebSocket============//

  joinChats(chatIds: string[]): void {
    this.emit('join chats', chatIds);
  }

  leaveChats(chatIds: string[]): void {
    this.emit('leave chats', chatIds);
  }

  listenMessages(): Observable<Message> {
    return this.listen<Message>('receive message').pipe(
      tap((message) => {
        const updatedChat =
        const updatedChats = {...this._userChats, }
        this._userChats$.next(updatedChats);
      })
    );
  }

  sendMessage(message: string, repliedOnMessageId?: number): void {
    const dto: dtos.SendMessage = {
      chatId: this.currentChatId$.value,
      ownerId: this.usersService.currentUser.id,
      body: message,
      sentDate: formatInTimeZone(
        new Date(),
        'America/New_York',
        'yyyy-MM-dd HH:mm:ss XXX'
      ),
      ...(repliedOnMessageId && { repliedOnMessageId }),
    };
    return this.emit<dtos.SendMessage>('send message', dto);
  }

  private addMessageToChat
}
