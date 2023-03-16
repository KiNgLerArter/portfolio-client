import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { BehaviorSubject, EMPTY, mergeWith, Observable, of } from "rxjs";
import { catchError, map, pairwise, take, tap } from "rxjs/operators";

import { setLoader } from "@basic/api";
import { WebSocketService } from "@basic/web-socket";
import { User, UserService } from "@entities/user";
import { convertDateToDBFormat, deepClone } from "@shared/utils";

import {
  Chat,
  ChatEvent,
  ChatPreview,
  CreateChatDTO,
  Message,
  MessageEvent,
  SendMessageDTO,
  WSEvent } from "../models";

@Injectable()
export class ChatService extends WebSocketService {
  private _userChats$ = new BehaviorSubject<ChatPreview[]>([]);
  private _currentChat$ = new BehaviorSubject<Chat>(null);

  private _messagesInput: UntypedFormControl;

  userChats$ = this._userChats$.asObservable();
  currentChat$ = this._currentChat$.asObservable();

  readonly SMILES = ["😶‍🌫️", "🥸", "😈", "🤠", "🥶", "😎", "👹", "☠️"];

  constructor(protected http: HttpClient, private userService: UserService) {
    super(http, "chats");
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

  private getCurrentChat(): Chat {
    return deepClone(this._currentChat$.value);
  }

  private getUserChats(): ChatPreview[] {
    return deepClone(this._userChats$.value);
  }

  init(input: UntypedFormControl): void {
    if (this._messagesInput) {
      throw new Error("Chat Service was already inited");
    }
    this._messagesInput = input;
  }

  setCurrentChat(chat: Chat) {
    this._currentChat$.next(chat);
  }

  isCurrentUserMessage(message: Message): boolean {
    return message.ownerId === this.userService.currentUser.id;
  }

  //============HTTP============//

  getChatById(chatId: Chat["id"]): Observable<Chat> {
    return this.get<Chat>(chatId, { context: setLoader(false) });
  }

  getChatsPreviews(userId: User["id"]): Observable<ChatPreview[]> {
    return this.get<ChatPreview[]>(`${userId}/chats-previews`, {
      rootUrl: "users",
      context: setLoader(false)
    }).pipe(
      tap((chats) => {
        this._userChats$.next(chats);
      }),
      catchError((error) => {
        console.log("[getUserChats error]:", error);
        return of([]);
      })
    );
  }

  createChat(dto: CreateChatDTO): Observable<Chat> {
    return this.post<Chat>("create", { body: dto }).pipe(
      tap((chat) => {
        const chats = this._userChats$.value;
        chats.push(new ChatPreview(chat));

        this._userChats$.next(chats);
        this._currentChat$.next(chat);

        this.joinChats(chat.id);
      }),
      catchError((error) => {
        console.log("[createChat error]:", error);
        return of(null);
      })
    );
  }

  //============WebSocket============//

  private listenMessagesReceiving(): Observable<WSEvent<Message>> {
    return this.listen<Message>(MessageEvent.RECEIVE).pipe(
      tap((receivedMessage) => {
        const currentChat = this.getCurrentChat();
        const userChats = deepClone(this._userChats$.value);

        if (receivedMessage.chatId !== currentChat.id) {
          userChats.find(
            (chat) => chat.id === receivedMessage.chatId
          ).lastMessage = {
            body: receivedMessage.body,
            owner: {
              id: receivedMessage.owner.id,
              nickname: receivedMessage.owner.nickname
            }
          };
          this._userChats$.next(userChats);
        } else {
          currentChat.messages.push(receivedMessage);
          this._currentChat$.next(currentChat);
        }

        if (this.isCurrentUserMessage(receivedMessage)) {
          this._messagesInput.setValue("");
        }
      }),
      map((receivedMessage) => ({
        type: MessageEvent.RECEIVE,
        data: receivedMessage
      }))
    );
  }

  private listenMessagesDeletion(): Observable<WSEvent<Message>> {
    return this.listen<Message>(MessageEvent.DELETE).pipe(
      tap((receivedMessage) => {
        console.log("[deletedMessage]:", receivedMessage);
        //Didn't use "filter" operator cause this stream may be used outside of the service
        if (receivedMessage.chatId !== this._currentChat$.value.id) {
          return;
        }
        const currentChat = this.getCurrentChat();
        const indexToDelete = currentChat.messages.findIndex(
          (message) => message.id === receivedMessage.id
        );
        currentChat.messages.splice(indexToDelete, 1);

        this._currentChat$.next(currentChat);
      }),
      map((receivedMessage) => ({
        type: MessageEvent.DELETE,
        data: receivedMessage
      }))
    );
  }

  joinChats(chatIds: string[] | string): void {
    if (typeof chatIds === "string") {
      this.emit(ChatEvent.JOIN, [chatIds]);
    }
    this.emit(ChatEvent.JOIN, chatIds);
  }

  leaveChats(
    chatIds: string[] = this.getUserChats().map((chat) => chat.id)
  ): void {
    if (typeof chatIds === "string") {
      this.emit(ChatEvent.LEAVE, [chatIds]);
    }
    this.emit(ChatEvent.LEAVE, chatIds);
  }

  leaveAllChats(): void {
    this.emit(
      ChatEvent.LEAVE,
      this.getUserChats().map((chat) => chat.id)
    );
  }

  sendMessage(message: string, repliedOnMessageId?: number): void {
    const dto: SendMessageDTO = {
      chatId: this._currentChat$.value.id,
      ownerId: this.userService.currentUser.id,
      body: message,
      sentDate: convertDateToDBFormat(new Date()),
      ...(repliedOnMessageId && { repliedOnMessageId })
    };
    return this.emit(MessageEvent.SEND, dto);
  }

  deleteMessage(message: Message): void {
    return this.emit(MessageEvent.DELETE, message);
  }

  listenMessages(): Observable<WSEvent<Message>> {
    return EMPTY.pipe(
      mergeWith(this.listenMessagesReceiving(), this.listenMessagesDeletion())
    );
  }
}
