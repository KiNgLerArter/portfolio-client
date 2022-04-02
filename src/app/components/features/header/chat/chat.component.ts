import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UsersService } from '@services/users/users.service';
import { deepClone } from '@shared/utils';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { Chat } from '../@types/chat.model';
import { CreateChatComponent } from './dialogs/create-chat/create-chat.component';
import { ChatsService } from '../services/chats/chats.service';
import { User } from '@shared/@types/users.model';

@UntilDestroy()
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('chat') set chat(elem: ElementRef) {
    const htmlElem = elem.nativeElement;
    this.chatsService.chatElement = htmlElem;
    htmlElem.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }

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

    this.chatsService
      .getUserChats(this.usersService.currentUser.id)
      .subscribe();
  }

  openCreateChatDialog(): void {
    this.dialog.open(CreateChatComponent, { width: '400px' });
  }
}
