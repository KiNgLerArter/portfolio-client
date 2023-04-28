import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  map,
  skip,
  switchMap,
  take,
  tap
} from "rxjs/operators";

import { ChatService } from "@entities/chat";
import { Chat } from "@entities/chat/models";

@UntilDestroy()
@Component({
  selector: "app-dropdown-chat-header",
  templateUrl: "./dropdown-chat-header.component.html",
  styleUrls: ["./dropdown-chat-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownChatHeaderComponent implements OnInit {
  @Input() height: string;

  currentChatId$ = new BehaviorSubject<string>(null);
  chats$ = this.chatService.userChats$.pipe(map(({ chats }) => chats));

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.initSubs();
  }

  private initSubs(): void {
    // Open last chat
    this.chatService.currentChat$
      .pipe(
        untilDestroyed(this),
        filter<Chat>(Boolean),
        take(1),
        tap(({ id }) => {
          this.currentChatId$.next(id);
        })
      )
      .subscribe();

    this.currentChatId$
      .pipe(
        untilDestroyed(this),
        filter<string>(Boolean),
        skip(1),
        distinctUntilChanged(),
        tap((id) => {
          console.log("[id]:", id);
        }),
        switchMap((id) => this.chatService.loadChatById(id)),
        tap((chat) => {
          console.log("[currentChatId$]");
          this.chatService.setCurrentChat(chat);
        })
      )
      .subscribe();
  }

  selectChat(id: string): void {
    this.currentChatId$.next(id);
  }
}
