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
import { chatDtos, chatDtos as dtos } from './model/chat.dto';
import { Chat, ChatEvents, message, Messages } from './model/chat.model';

@Injectable()
export class ChatsService extends WebSocketService {
  private _userChats$ = new BehaviorSubject<Chat[]>([]);
  private _userChatsMessages$ = new BehaviorSubject<Messages>({});

  currentChat$ = new BehaviorSubject<Chat>(null);
  userChats$ = this._userChats$.asObservable();
  userChatsMessages$ = this._userChatsMessages$.asObservable();

  messageInput: FormControl;
  chatElement: HTMLElement;

  readonly SMILES = ['😶‍🌫️', '🥸', '😈', '🤠', '🥶', '😎', '🤢', '👹', '☠️'];

  private get _userChats(): Chat[] {
    return deepClone(this._userChats$.value);
  }

  private get _messages(): Messages {
    return deepClone(this._userChatsMessages$.value);
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

  getUserChats(userId: number): Observable<chatDtos.FetchChat[]> {
    return this.get<chatDtos.FetchChat[]>(`${userId}/chats`, {
      rootUrl: 'users',
      context: new HttpContext().set(IS_LOADER, false),
    }).pipe(
      tap((chats) => {
        const messages: Messages = {};
        chats.forEach((chat) => {
          messages[chat.id] = chat.messages;
          delete chat.messages;
        });

        this._userChatsMessages$.next(messages);
        this._userChats$.next(chats as Chat[]);
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
    console.log('[listening messages]');
    return this.listen<message.BE>('receive message').pipe(
      tap((receivedMessage) => {
        console.log('[receivedMessage]:', receivedMessage);
        console.log('[this._messages]:', this._messages);
        const messages = this._messages;
        messages[receivedMessage.chatId].push(receivedMessage);
        this._userChatsMessages$.next(messages);
        if (this.isCurrentUserMessage(receivedMessage)) {
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
}
