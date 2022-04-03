import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UsersService } from '@services/users/users.service';
import { deepClone } from '@shared/utils';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { Chat } from '../services/chats/@types/chat.model';
import { CreateChatComponent } from './dialogs/create-chat/create-chat.component';
import { ChatsService } from '../services/chats/chats.service';
import { User } from '@shared/@types/users.model';

@UntilDestroy()
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
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
  }

  ngOnDestroy(): void {
    this.chatsService.leaveChats();
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

    //added messages object in the service, needs to be implemented

    this.chatsService.currentChat$
      .pipe(
        untilDestroyed(this),
        filter((chat) => !!chat),
        distinctUntilChanged(
          (prev, curr) => prev.messages.length === curr.messages.length
        ),
        map((chat) => chat.messages.slice(-1)[0]),
        tap((message) => {
          setTimeout(() => {
            if (
              this.chatsService.isCurrentUserMessage(message) ||
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

    this.chatsService
      .getUserChats(this.usersService.currentUser.id)
      .subscribe();
  }

  getRandomSmile(): string {
    return this.chatsService.SMILES[
      Math.floor(Math.random() * this.chatsService.SMILES.length)
    ];
  }

  openCreateChatDialog(): void {
    this.dialog.open(CreateChatComponent, { width: '400px' });
  }
}
