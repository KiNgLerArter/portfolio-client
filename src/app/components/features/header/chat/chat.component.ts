import { Component, OnInit } from '@angular/core';
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
  userChats: Chat[];

  get currentUser(): User {
    return this.usersService.currentUser;
  }

  get selectedChat(): Chat {
    return this.userChats.find((chat) => chat.id === this.selectedChatId);
  }

  get selectedChatId(): string {
    return this.chatsService.currentChatId$.value;
  }

  set selectedChatId(id: string) {
    this.chatsService.currentChatId$.next(id);
  }

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
        filter((chats) => !!chats?.length),
        tap(() => {}),
        take(1),
        tap((chats) => {
          this.selectedChatId = chats[0].id;
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

    this.chatsService
      .getUserChats(this.usersService.currentUser.id)
      .subscribe();
  }

  openCreateChatDialog(): void {
    this.dialog.open(CreateChatComponent, { width: '400px' });
  }
}
