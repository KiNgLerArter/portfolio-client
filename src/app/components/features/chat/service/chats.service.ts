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
  ChatEvent,
  message,
  Messages,
  ChatPreview,
  MessageEvent,
} from '../models/chat.model';

@Injectable()
export class ChatsService extends WebSocketService {
  private _userChats$ = new BehaviorSubject<ChatPreview[]>([]);
  private _currentChat$ = new BehaviorSubject<Chat>(null);

  private _messagesInput: FormControl;

  userChats$ = this._userChats$.asObservable();
  currentChat$ = this._currentChat$.asObservable();

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
          if (prev.length) {
            this.leaveChats(prev.map((chat) => chat.id));
          }

          this.joinChats(curr.map((chat) => chat.id));
        })
      )
      .subscribe();
  }

  setCurrentChat(chat: Chat) {
    this._currentChat$.next(chat);
  }

  setMessagesInput(input: FormControl): void {
    this._messagesInput = input;
  }

  isCurrentUserMessage(message: message.BE): boolean {
    return message.ownerId === this.usersService.currentUser.id;
  }

  //============HTTP============//

  getChatById(chatId: Chat['id']): Observable<Chat> {
    return this.get<Chat>(chatId, { context: setLoader(false) });
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
      this.emit(ChatEvent.JOIN, [chatIds]);
    }
    this.emit(ChatEvent.JOIN, chatIds);
  }

  leaveChats(chatIds: string[] = this._userChats.map((chat) => chat.id)): void {
    if (typeof chatIds === 'string') {
      this.emit(ChatEvent.LEAVE, [chatIds]);
    }
    this.emit(ChatEvent.LEAVE, chatIds);
  }

  listenMessages(): Observable<message.BE> {
    return this.listen<message.BE>(MessageEvent.RECEIVE).pipe(
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
          this._messagesInput.setValue('');
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
    return this.emit(MessageEvent.SEND, dto);
  }

  deleteMessage(messageId: message.BE['id']): void {
    return this.emit(MessageEvent.DELETE, messageId);
  }

  //========
}
