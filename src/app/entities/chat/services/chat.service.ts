import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, EMPTY, mergeWith, Observable, of } from "rxjs";
import {
  catchError,
  filter,
  map,
  pairwise,
  switchMap,
  take,
  tap
} from "rxjs/operators";

import { setLoader } from "@basic/api";
import { DomService } from "@basic/dom";
import { WebSocketService } from "@basic/web-socket";
import { User } from "@entities/user";
import { AuthService } from "@shared/lib/auth";
import { convertDateToDBFormat, deepClone } from "@shared/utils";

import {
  Chat,
  ChatEvent,
  ChatPreview,
  ChatView,
  ChatViewType,
  CreateChatDTO,
  Message,
  MessageEvent,
  SendMessageDTO,
  WSEvent
} from "../models";

@UntilDestroy()
@Injectable()
export class ChatService extends WebSocketService {
  private _userChats$ = new BehaviorSubject<{
    chats?: ChatPreview[];
    modifiedChat?: ChatPreview;
  }>({});
  private _currentChat$ = new BehaviorSubject<Chat>(null);
  private _view$ = new BehaviorSubject<ChatView<any>>({
    type: ChatViewType.DROP
  });

  private _messagesInput: FormControl<string>;

  userChats$ = this._userChats$.asObservable();
  currentChat$ = this._currentChat$.asObservable();
  view$ = this._view$.asObservable();

  readonly SMILES = ["😶‍🌫️", "🥸", "😈", "🤠", "🥶", "😎", "👹", "☠️"];

  constructor(
    protected http: HttpClient,
    private authService: AuthService,
    private domService: DomService
  ) {
    super(http, "chats");

    this.initSubs();
  }

  isCurrentUserMessage(message: Message): boolean {
    return message.ownerId === this.authService.getCurrentUserId();
  }

  isCurrentChat(id: Chat["id"]): boolean {
    return id === this._currentChat$.value.id;
  }

  getInput(): FormControl<string> {
    return (
      this._messagesInput ??
      this.init(new FormControl("", [Validators.maxLength(250)]))
    );
  }

  setCurrentChat(chat: Chat): void {
    console.log("[chat]:", chat);
    this._currentChat$.next(chat);
  }

  setView<T>(view: ChatView<T>): void {
    this.domService.removeComponentFromBody(this.getView().component);
    this.domService.appendComponentToBody(view.component);

    this._view$.next(view);
  }

  private initSubs(): void {
    this.authService.currentUserId$
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        take(1),
        switchMap(() =>
          this.loadChatsPreviews(this.authService.getCurrentUserId())
        ),
        //TODO
        //Should save last opened chat and read message and retrieve it from localStorage
        switchMap((chats) => this.loadChatById(chats[0].id))
      )
      .subscribe((chat) => {
        this.setCurrentChat(chat);
      });

    this._userChats$
      .pipe(
        untilDestroyed(this),
        map(({ chats }) => chats),
        pairwise(),
        take(1)
      )
      .subscribe(([prev, curr]) => {
        if (prev?.length) {
          this.leaveChats(prev.map((chat) => chat.id));
        }

        this.joinChats(curr.map((chat) => chat.id));
      });
  }

  private init(input: FormControl<string>): FormControl<string> {
    if (this._messagesInput) {
      throw new Error("ChatService was already inited");
    }
    this._messagesInput = input;
    return input;
  }

  private getCurrentChat(): Chat {
    return deepClone(this._currentChat$.value);
  }

  private getUserChats(): ChatPreview[] {
    console.log(
      "[getUserChats messages]:",
      this._userChats$.value.chats[0].messages
    );
    return deepClone(this._userChats$.value.chats);
  }

  private getView(): ChatView<any> {
    return this._view$.value;
  }

  private editChat(updatedChat: Chat): void {
    const userChats = this.getUserChats();

    const updatedChatPreview = new ChatPreview(updatedChat);

    const chatToUpdateIndex = userChats.findIndex(
      (chat) => updatedChat.id === chat.id
    );
    userChats[chatToUpdateIndex] = updatedChatPreview;

    this._userChats$.next({
      chats: userChats,
      modifiedChat: updatedChatPreview
    });

    if (this._currentChat$.value.id === updatedChat.id) {
      this.setCurrentChat(updatedChat);
    }
  }

  private initChat(newChat: Chat): void {
    const newChatPreview = new ChatPreview(newChat);
    const chats = this.getUserChats();

    chats.push(newChatPreview);

    this._userChats$.next({ chats, modifiedChat: newChatPreview });
    this.setCurrentChat(newChat);
  }

  //============HTTP============//

  loadChatById(chatId: Chat["id"]): Observable<Chat> {
    return this.get<Chat>(chatId, { context: setLoader(false) });
  }

  loadChatsPreviews(userId: User["id"]): Observable<ChatPreview[]> {
    return this.get<ChatPreview[]>(`${userId}/chats/previews`, {
      rootUrl: "users",
      context: setLoader(false)
    }).pipe(
      tap((chats) => {
        console.log("[chats]:", chats);
        this._userChats$.next({
          chats: chats.map((chat) => new ChatPreview(chat))
        });
      }),
      catchError((error) => {
        console.log("[loadChatsPreviews error]:", error);
        return of([]);
      })
    );
  }

  createChat(dto: CreateChatDTO): Observable<Chat> {
    return this.post<Chat>("create", { body: dto }).pipe(
      tap((chat) => {
        this.initChat(chat);

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
        const chats = this.getUserChats();
        const currentChat = this.getCurrentChat();

        let modifiedChat;
        if (currentChat.id === receivedMessage.chatId) {
          modifiedChat = currentChat;
          modifiedChat.messages.push(receivedMessage);
        } else {
          modifiedChat = chats.find(
            (chat) => chat.id === receivedMessage.chatId
          );
          modifiedChat.addMessage(receivedMessage);
        }
        this.editChat(modifiedChat);

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
        const chats = this.getUserChats();
        const currentChat = this.getCurrentChat();

        let modifiedChat;
        if (currentChat.id === receivedMessage.chatId) {
          modifiedChat = currentChat;
          const indexToDelete = modifiedChat.messages.findIndex(
            (message) => message.id === receivedMessage.id
          );
          modifiedChat.messages.splice(indexToDelete, 1);
        } else {
          modifiedChat = chats.find(
            (chat) => chat.id === receivedMessage.chatId
          );
          modifiedChat.deleteMessage(receivedMessage.id);
        }
        this.editChat(modifiedChat);
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
      ownerId: this.authService.getCurrentUserId(),
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
