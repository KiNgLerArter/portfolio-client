import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from "@angular/core";
import {
  MatBottomSheet,
  MatBottomSheetRef
} from "@angular/material/bottom-sheet";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, take, tap } from "rxjs/operators";

import { Chat, ChatService, Message } from "@entities/chat";

@UntilDestroy()
@Component({
  selector: "app-chat-body",
  templateUrl: "./chat-body.component.html",
  styleUrls: ["./chat-body.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBodyComponent implements OnInit, OnDestroy {
  @ViewChild("messageOptions") messageOptions: TemplateRef<any>;
  @ViewChild("chatBody")
  set chatBody(elem: ElementRef) {
    this._chatBody = elem.nativeElement;
  }
  @ViewChild("chatMessagesElem") set chatMessagesElem(elem: ElementRef) {
    const htmlElem = elem.nativeElement;
    this._chatBodyMessages = htmlElem;
    htmlElem.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }

  @Input() chat$: Observable<Chat>;
  @Input() openAnimationDuration: number;
  @Input() host?: string;

  private _chatBody: any;
  private _chatBodyMessages: any;
  private _bottomSheetRef: MatBottomSheetRef;
  private _chatMessages$: Observable<Message[]>;

  currentMessage$ = new BehaviorSubject<Message>(null);
  chatMessages: Message[];

  constructor(
    protected chatService: ChatService,
    private bottomSheet: MatBottomSheet,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initVars();
    this.initSubs();
  }

  ngOnDestroy(): void {
    this.chatService.leaveAllChats();
  }

  identifyMessage(_: number, item: Message): string {
    return item.id;
  }

  openMessageOptions(event: Event, message: Message): void {
    event.preventDefault();
    this.currentMessage$.next(message);

    if (!this._bottomSheetRef) {
      this._bottomSheetRef = this.bottomSheet.open(this.messageOptions);
      this._bottomSheetRef
        .afterDismissed()
        .pipe(
          untilDestroyed(this),
          take(1),
          tap(() => {
            this._bottomSheetRef = null;
          })
        )
        .subscribe();
    }
  }

  onCallMessageEvent(): void {
    this._bottomSheetRef.dismiss();
  }

  private initVars(): void {
    this._chatMessages$ = this.chat$.pipe(
      untilDestroyed(this),
      tap((chat) => console.log("[chat.messages]:", chat.messages)),
      map((chat) => chat?.messages ?? [])
    );
  }

  private initSubs(): void {
    //scroll to the bottom of the chat if the user sent a message
    this._chatMessages$
      .pipe(
        tap((messages) => {
          this.chatMessages = messages;
          this.cdr.markForCheck();
        }),
        map((messages) => messages.slice(-1)[0]),
        filter((lastMessage) => !!lastMessage),
        tap((lastMessage) => {
          this.cdr.detectChanges();

          if (
            this.chatService.isCurrentUserMessage(lastMessage) ||
            this._chatBody.scrollTop > this._chatBody.scrollHeight - 500
          ) {
            this.scrollToTheBottom();
          }
        })
      )
      .subscribe();

    //load chats and scroll to the bottom
    this.chatService.userChats$
      .pipe(
        filter(Boolean),
        take(1),
        tap(() => {
          this.cdr.detectChanges();
          this.scrollToTheBottom();
        })
      )
      .subscribe();

    this.chatService.listenMessages().subscribe();
  }

  private scrollToTheBottom(): void {
    this._chatBodyMessages?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }
}
