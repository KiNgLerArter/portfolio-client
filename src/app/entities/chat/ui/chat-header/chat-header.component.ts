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
import { ChatPreview } from "../../models";
import { ChatService } from "../../services";
import { CreateChatDialogComponent } from "../create-chat-dialog";

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

  constructor(private chatService: ChatService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initVars();
    this.initSubs();
  }

  private initVars(): void {
    this.chats$ = this.chatService.userChats$;
  }

  private initSubs(): void {
    this.currentChatId$
      .pipe(
        filter((id) => !!id),
        distinctUntilChanged(),
        switchMap((id) => this.chatService.getChatById(id)),
        tap((chat) => {
          this.chatService.setCurrentChat(chat);
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

  selectChat(id: string): void {
    this.currentChatId$.next(id);
  }

  openCreateChatDialog(): void {
    this.dialog.open(CreateChatDialogComponent, { width: "400px" });
  }
}
