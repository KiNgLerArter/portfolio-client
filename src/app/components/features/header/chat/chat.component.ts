import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UsersService } from '@services/users/users.service';
import { deepClone } from '@shared/utils';
import { Observable } from 'rxjs';
import { distinctUntilChanged, switchMap, take, tap } from 'rxjs/operators';
import { Chat } from './@types/chat.model';
import { CreateChatComponent } from './dialogs/create-chat/create-chat.component';
import { ChatsService } from './service/chats.service';

@UntilDestroy()
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  selectedChatCtrl = new FormControl();
  userChats: Chat[];

  constructor(
    private chatsService: ChatsService,
    private usersService: UsersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initSubs();
  }

  private initSubs(): void {
    const userChatsObs = this.chatsService.userChats$.pipe(
      untilDestroyed(this)
    );

    userChatsObs
      .pipe(
        take(1),
        tap((chats) => {
          this.selectedChatCtrl = new FormControl(chats[0]);
        }),
        switchMap(() => this.selectedChatCtrl.valueChanges as Observable<Chat>),
        distinctUntilChanged(),
        tap((chat) => {
          console.log('[formControl emitted]:', chat);
          this.chatsService.selectedChat$.next(chat);
        })
      )
      .subscribe();

    userChatsObs
      .pipe(
        tap((chats) => {
          this.userChats = deepClone(chats);
        })
      )
      .subscribe();

    this.chatsService.selectedChat$
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged(),
        tap((chat) => {
          console.log('[subject emitted]:', chat);
          this.selectedChatCtrl.setValue(chat);
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
