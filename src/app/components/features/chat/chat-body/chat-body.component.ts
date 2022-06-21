import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
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
import { message } from '../models/chat.model';
import { ChatsService } from '../service/chats.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@UntilDestroy()
@Component({
  selector: 'app-chat-body',
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatBodyComponent implements OnInit {
  @ViewChild('messageOptions') messageOptions: TemplateRef<any>;
  @ViewChild('chatBody')
  set chat(elem: ElementRef) {
    this._chatBody = elem.nativeElement;
  }
  @ViewChild('chatMessages') set chatBody(elem: ElementRef) {
    const htmlElem = elem.nativeElement;
    this._chatBodyMessages = htmlElem;
    htmlElem.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }

  @Input() height: string;

  private _chatBody: any;
  private _chatBodyMessages: any;
  private _bottomSheetRef: MatBottomSheetRef;

  currentChatMessages$: Observable<message.BE[]>;
  currentMessage$ = new BehaviorSubject<message.BE>(null);

  constructor(
    public chatsService: ChatsService,
    public usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private bottomSheet: MatBottomSheet
  ) {}

  //new message isn't being rendered, double emit of Observables

  ngOnInit(): void {
    this.initVars();
    this.initSubs();
  }

  ngOnDestroy(): void {
    this.chatsService.leaveChats();
  }

  getRandomSmile(): string {
    return this.chatsService.SMILES[
      Math.floor(Math.random() * this.chatsService.SMILES.length)
    ];
  }

  identifyMessage(index: number, item: message.BE): string {
    return item.id;
  }

  openMessageOptions(event: Event, message: message.BE): void {
    event.preventDefault();
    this.currentMessage$.next(message);

    if (!this._bottomSheetRef) {
      this._bottomSheetRef = this.bottomSheet.open(this.messageOptions, {
        hasBackdrop: false,
      });
    }
  }

  deleteMessage(id: message.BE['id'] = this.currentMessage$.value.id): void {
    this.chatsService.deleteMessage(id);
  }

  private initVars(): void {
    this.currentChatMessages$ = this.chatsService.currentChat$.pipe(
      untilDestroyed(this),
      map((chat) => chat?.messages ?? [])
    );
  }

  private initSubs(): void {
    //scroll to the bottom of the chat if the user sent a message
    this.currentChatMessages$
      .pipe(
        map((messages) => messages.slice(-1)[0]),
        filter((lastMessage) => !!lastMessage),
        tap((lastMessage) => {
          setTimeout(() => {
            if (
              this.chatsService.isCurrentUserMessage(lastMessage) ||
              this._chatBody.scrollTop > this._chatBody.scrollHeight - 500
            ) {
              this._chatBodyMessages.scrollIntoView({
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
      .getChatsPreviews(this.usersService.currentUser.id)
      .subscribe();

    this.chatsService.listenMessages().subscribe();
  }
}
