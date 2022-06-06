import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UsersService } from '@services/users/users.service';
import { deepClone } from '@shared/utils';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { Chat, message, Messages } from '../service/model/chat.model';
import { ChatsService } from '../service/chats.service';
import { CreateChatComponent } from '../mat-dialogs/create-chat/create-chat.component';

@UntilDestroy()
@Component({
  selector: 'app-chat-body',
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.scss'],
})
export class ChatBodyComponent implements OnInit {
  @ViewChild('chat') set chat(elem: ElementRef) {
    this._chatElem = elem.nativeElement;
  }
  @ViewChild('chatBody') set chatBody(elem: ElementRef) {
    const htmlElem = elem.nativeElement;
    this.chatsService.chatElement = htmlElem;
    this._chatBodyElem = htmlElem;
    htmlElem.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }

  private _chatElem: any;
  private _chatBodyElem: any;
  private _allMessages: Messages;

  currentChatMessages: message.BE[] = [];

  get currentChat(): Chat {
    return this.chatsService.currentChat$.value;
  }

  get currentChatId(): string {
    return this.chatsService.currentChat$.value?.id;
  }

  set currentChatId(id: string) {
    this.chatsService.currentChat$.next(this.chatsService.getChatById(id));
  }

  constructor(
    public chatsService: ChatsService,
    public usersService: UsersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initSubs();
    this.chatsService.listenMessages().subscribe();
  }

  ngOnDestroy(): void {
    this.chatsService.leaveChats();
  }

  getRandomSmile(): string {
    return this.chatsService.SMILES[
      Math.floor(Math.random() * this.chatsService.SMILES.length)
    ];
  }

  openCreateChatDialog(): void {
    this.dialog.open(CreateChatComponent, { width: '400px' });
  }

  private initSubs(): void {
    this.chatsService.userChats$
      .pipe(
        untilDestroyed(this),
        filter((chats) => !!chats?.length),
        take(1),
        tap((chats) => {
          this.currentChatId = chats[0].id;
        })
      )
      .subscribe();

    this.chatsService.userChats$
      .pipe(
        untilDestroyed(this),
        filter((chats) => !!chats?.length),
        switchMap(() => this.chatsService.userChatsMessages$),
        tap((messages) => {
          this.currentChatMessages = deepClone(messages[this.currentChatId]);
          this._allMessages = messages;
        }),
        map((messages) => messages[this.currentChatId]),
        filter((currChatMessages) => !!currChatMessages?.length),
        distinctUntilChanged((prev, curr) => {
          return prev.length >= curr.length;
        }),
        map((currChatMessages) => currChatMessages.slice(-1)[0]),
        tap((lastMessage) => {
          setTimeout(() => {
            if (
              this.chatsService.isCurrentUserMessage(lastMessage) ||
              this._chatElem.scrollTop > this._chatElem.scrollHeight - 500
            ) {
              this._chatBodyElem.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
              });
            }
          });
        })
      )
      .subscribe();

    this.chatsService.currentChat$
      .pipe(
        filter((chat) => !!chat && !!this._allMessages),
        tap((chat) => {
          this.currentChatMessages = deepClone(this._allMessages[chat.id]);
        })
      )
      .subscribe();

    this.chatsService
      .getUserChats(this.usersService.currentUser.id)
      .subscribe();
  }
}
