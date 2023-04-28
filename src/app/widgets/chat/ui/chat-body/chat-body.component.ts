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
import { BehaviorSubject } from "rxjs";
import { filter, map, take, tap } from "rxjs/operators";

import { ChatService, Message } from "@entities/chat";

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
  @ViewChild("chatMessages") set chatMessages(elem: ElementRef) {
    const htmlElem = elem.nativeElement;
    this._chatBodyMessages = htmlElem;
    htmlElem.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }

  @Input() openAnimationDuration: number;

  private _chatBody: any;
  private _chatBodyMessages: any;
  private _bottomSheetRef: MatBottomSheetRef;
  private _currentChatMessages$ = this.chatService.currentChat$.pipe(
    untilDestroyed(this),
    map((chat) => chat?.messages ?? [])
  );

  currentMessage$ = new BehaviorSubject<Message>(null);
  currentChatMessages: Message[];

  constructor(
    public chatService: ChatService,
    private bottomSheet: MatBottomSheet,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

  private initSubs(): void {
    //scroll to the bottom of the chat if the user sent a message
    this._currentChatMessages$
      .pipe(
        tap((messages) => {
          this.currentChatMessages = messages;
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
