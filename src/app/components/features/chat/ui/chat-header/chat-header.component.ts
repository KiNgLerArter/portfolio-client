import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, Observable } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  switchMap,
  take,
  tap
} from "rxjs/operators";
import { ChatPreview } from "../../models/chat.model";
import { ChatsService } from "../../services/chats.service";
import { CreateChatComponent } from "../mat-dialogs/create-chat/create-chat.component";

@UntilDestroy()
@Component({
  selector: "app-chat-header",
  templateUrl: "./chat-header.component.html",
  styleUrls: ["./chat-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatHeaderComponent implements OnInit {
  @Input() height: string;

  currentChatId$ = new BehaviorSubject<string>(null);
  chats$: Observable<ChatPreview[]>;

  constructor(private chatsService: ChatsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initVars();
    this.initSubs();
  }

  selectChat(id: string): void {
    this.currentChatId$.next(id);
  }

  openCreateChatDialog(): void {
    this.dialog.open(CreateChatComponent, { width: "400px" });
  }

  private initVars(): void {
    this.chats$ = this.chatsService.userChats$;
  }

  private initSubs(): void {
    this.currentChatId$
      .pipe(
        filter((id) => !!id),
        distinctUntilChanged(),
        switchMap((id) => this.chatsService.getChatById(id)),
        tap((chat) => {
          this.chatsService.setCurrentChat(chat);
        })
      )
      .subscribe();

    // Initialize first chat
    this.chats$
      .pipe(
        untilDestroyed(this),
        filter((chats) => !!chats?.length),
        take(1),
        tap((chats) => {
          this.currentChatId$.next(chats[0].id);
        })
      )
      .subscribe();
  }
}
