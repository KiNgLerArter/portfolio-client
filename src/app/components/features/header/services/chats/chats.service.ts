import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IS_LOADER } from '@services/api/api.service';
import { UsersService } from '@services/users/users.service';
import { WebSocketService } from '@services/web-socket/web-socket.service';
import { deepClone } from '@shared/utils';
import { formatInTimeZone } from 'date-fns-tz';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, pairwise, startWith, tap } from 'rxjs/operators';
import { chatDtos as dtos } from './@types/chat.dto';
import { Chat, ChatEvents, message } from './@types/chat.model';

@Injectable()
export class ChatsService extends WebSocketService {
  messageInput: FormControl;
  chatElement: HTMLElement;
  currentChat$ = new BehaviorSubject<Chat>(null);

  readonly SMILES = ['😶‍🌫️', '🥸', '😈', '🤠', '🥶', '😎', '🤢', '👹', '☠️'];

  private _userChats$ = new BehaviorSubject<Chat[]>([]);

  get userChats$(): Observable<Chat[]> {
    return this._userChats$.asObservable();
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

        this.currentChat$.next(chat);
      }),
      catchError((error) => {
        console.log('[createChat error]:', error);
        return of(null);
      })
    );
  }

  //============WebSocket============//

  joinChats(chatIds: string[] | string): void {
    if (typeof chatIds === 'string') {
      this.emit(ChatEvents.JOIN, [chatIds]);
    }
    this.emit(ChatEvents.JOIN, chatIds);
  }

  leaveChats(chatIds: string[] = this._userChats.map((chat) => chat.id)): void {
    if (typeof chatIds === 'string') {
      this.emit(ChatEvents.LEAVE, [chatIds]);
    }
    this.emit(ChatEvents.LEAVE, chatIds);
  }

  listenMessages(): Observable<message.BE> {
    return this.listen<message.BE>('receive message').pipe(
      tap((message) => {
        this.addMessageToChat(message);
        if (this.isCurrentUserMessage(message)) {
          this.messageInput.setValue('');
        }
      })
    );
  }

  sendMessage(message: string, repliedOnMessageId?: number): void {
    const dto: dtos.SendMessage = {
      chatId: this.currentChat$.value.id,
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

  //========

  getChatById(id: string): Chat {
    return this._userChats.find((chat) => chat.id === id);
  }

  isCurrentUserMessage(message: message.BE): boolean {
    return message.ownerId === this.usersService.currentUser.id;
  }

  private addMessageToChat(message: message.BE): void {
    const updatedChats = this._userChats;
    updatedChats.some((chat) => {
      if (chat.id === message.chatId) {
        chat.messages.push(message);
        if (this.currentChat$.value.id === chat.id) {
          this.currentChat$.next(chat);
        }
        return true;
      }
      return false;
    });

    this._userChats$.next(updatedChats);
  }
}
