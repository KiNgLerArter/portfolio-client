import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { setLoader } from '@services/api/config/api.config';
import { UsersService } from '@services/users/users.service';
import { WebSocketService } from '@services/web-socket/web-socket.service';
import { User } from '@shared/models/users.model';
import { convertToDBFormat, deepClone } from '@shared/utils';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  catchError,
  map,
  pairwise,
  startWith,
  take,
  tap,
} from 'rxjs/operators';
import { chatDtos, chatDtos as dtos } from '../models/chat.dto';
import {
  Chat,
  ChatEvents,
  message,
  Messages,
  ChatPreview,
} from '../models/chat.model';

@Injectable()
export class ChatsService extends WebSocketService {
  // TODO
  // Use _currentChat$ to get current chat messages
  // Rework _userChats$ model so it will be simple: the chat should contain id, name, lastMessage
  // When changing chat load the chat and it's messages from BE
  private _userChats$ = new BehaviorSubject<ChatPreview[]>([]);
  private _currentChat$ = new BehaviorSubject<Chat>(null);

  userChats$ = this._userChats$.asObservable();
  currentChat$ = this._currentChat$.asObservable();

  messageInput: FormControl;
  chatElement: HTMLElement;

  readonly SMILES = ['😶‍🌫️', '🥸', '😈', '🤠', '🥶', '😎', '👹', '☠️'];

  private get _userChats(): ChatPreview[] {
    return deepClone(this._userChats$.value);
  }

  constructor(protected http: HttpClient, private usersService: UsersService) {
    super(http, 'chats');
    this._userChats$
      .pipe(
        pairwise(),
        take(1),
        tap(([prev, curr]) => {
          console.log('[prev, curr]:', prev, curr);

          if (prev.length) {
            this.leaveChats(prev.map((chat) => chat.id));
          }

          this.joinChats(curr.map((chat) => chat.id));
        })
      )
      .subscribe();
  }

  setCurrentChat(chat: Chat) {
    console.log('[chat]:', chat);
    this._currentChat$.next(chat);
  }

  isCurrentUserMessage(message: message.BE): boolean {
    return message.ownerId === this.usersService.currentUser.id;
  }

  //============HTTP============//

  getChatById(chatId: Chat['id']): Observable<Chat> {
    return this.get<Chat>(chatId);
  }

  getChatsPreviews(userId: User['id']): Observable<ChatPreview[]> {
    return this.get<ChatPreview[]>(`${userId}/chats-previews`, {
      rootUrl: 'users',
      context: setLoader(false),
    }).pipe(
      tap((chats) => {
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
        chats.push(new ChatPreview(chat));

        this._userChats$.next(chats);
        this._currentChat$.next(chat);

        this.joinChats(chat.id);
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

        const currentChat = deepClone(this._currentChat$.value);
        const userChats = deepClone(this._userChats$.value);

        userChats.find(
          (chat) => chat.id === receivedMessage.chatId
        ).lastMessage = {
          body: receivedMessage.body,
          owner: {
            id: receivedMessage.ownerId,
            nickname: receivedMessage.owner.nickname,
          },
        };
        currentChat.messages.push(receivedMessage);

        this._currentChat$.next(currentChat);
        this._userChats$.next(userChats);

        if (this.isCurrentUserMessage(receivedMessage)) {
          this.messageInput.setValue('');
        }
      })
    );
  }

  sendMessage(message: string, repliedOnMessageId?: number): void {
    const dto: dtos.SendMessage = {
      chatId: this._currentChat$.value.id,
      ownerId: this.usersService.currentUser.id,
      body: message,
      sentDate: convertToDBFormat(new Date()),
      ...(repliedOnMessageId && { repliedOnMessageId }),
    };
    return this.emit<dtos.SendMessage>('send message', dto);
  }

  //========
}
