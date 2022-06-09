import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UsersService } from '@services/users/users.service';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { Chat, ChatPreview, message, Messages } from '../models/chat.model';
import { ChatsService } from '../service/chats.service';
import { CreateChatComponent } from '../mat-dialogs/create-chat/create-chat.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { deepEqual } from '@shared/utils';
import { MatSelectChange } from '@angular/material/select';

@UntilDestroy()
@Component({
  selector: 'app-chat-body',
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  chats$: Observable<ChatPreview[]>;
  currentChatMessages$: Observable<message.BE[]>;
  currentChatId$ = new BehaviorSubject<string>(null);

  constructor(
    public chatsService: ChatsService,
    public usersService: UsersService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initVars();
    this.initSubs();
  }

  ngOnDestroy(): void {
    this.chatsService.leaveChats();
  }

  changeChat(event: MatSelectChange): void {
    this.currentChatId$.next(event.value);
  }

  getRandomSmile(): string {
    return this.chatsService.SMILES[
      Math.floor(Math.random() * this.chatsService.SMILES.length)
    ];
  }

  openCreateChatDialog(): void {
    this.dialog.open(CreateChatComponent, { width: '400px' });
  }

  identifyMessage(index: number, item: message.BE) {
    return item.id;
  }

  private initVars(): void {
    this.currentChatMessages$ = this.chatsService.currentChat$.pipe(
      untilDestroyed(this),
      distinctUntilChanged(
        (curr, next) =>
          curr.id === next.id || deepEqual(curr.messages, next.messages)
      ),
      map((chat) => chat.messages)
    );

    this.chats$ = this.chatsService.userChats$;
  }

  private initSubs(): void {
    this.currentChatId$
      .pipe(switchMap((id) => this.chatsService.getChatById(id)))
      .subscribe();

    // Initialize first chat
    this.chatsService.userChats$
      .pipe(
        untilDestroyed(this),
        filter((chats) => !!chats?.length),
        take(1),
        tap((chats) => {
          this.currentChatId$.next(chats[0].id);
        })
      )
      .subscribe();

    //scroll to the bottom of the chat if the user sent a message
    this.currentChatMessages$
      .pipe(
        map((messages) => messages.slice(-1)[0]),
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

    //load chats
    this.chatsService
      .getChatPreviews(this.usersService.currentUser.id)
      .subscribe();

    this.chatsService.listenMessages().subscribe();
  }
}
