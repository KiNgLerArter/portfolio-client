import {
  ChangeDetectionStrategy,
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

import { ChatService, Message } from "@entities/chat";
import { UserService } from "@entities/user";

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

  currentChatMessages$: Observable<Message[]>;
  currentMessage$ = new BehaviorSubject<Message>(null);

  constructor(
    public chatService: ChatService,
    public userService: UserService,
    private bottomSheet: MatBottomSheet
  ) {}

  //new message isn't being rendered, double emit of Observables

  ngOnInit(): void {
    this.initVars();
    this.initSubs();
  }

  ngOnDestroy(): void {
    this.chatService.leaveAllChats();
  }

  // getRandomSmile(): string {
  //   return this.chatService.SMILES[
  //     Math.floor(Math.random() * this.chatService.SMILES.length)
  //   ];
  // }

  identifyMessage(index: number, item: Message): string {
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
    this.currentChatMessages$ = this.chatService.currentChat$.pipe(
      untilDestroyed(this),
      map((chat) => chat?.messages ?? []),
      tap((messages) => console.log("[messages]:", messages))
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
              this.chatService.isCurrentUserMessage(lastMessage) ||
              this._chatBody.scrollTop > this._chatBody.scrollHeight - 500
            ) {
              this.scrollToTheBottom();
            }
          });
        })
      )
      .subscribe();

    //load chats and scroll to the bottom
    this.chatService
      .getChatsPreviews(this.userService.currentUser.id)
      .pipe(
        tap(() => {
          setTimeout(() => {
            this.scrollToTheBottom();
          }, this.openAnimationDuration);
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
