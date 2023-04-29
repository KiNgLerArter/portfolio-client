import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { filter, map, Observable } from "rxjs";

import { ChatPreview, ChatService } from "@entities/chat";

@Component({
  selector: "app-chat-preview",
  templateUrl: "./chat-preview.component.html",
  styleUrls: ["./chat-preview.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatPreviewComponent implements OnInit {
  @Input() chat: ChatPreview;

  chat$: Observable<ChatPreview>;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chat$ = this.chatService.userChats$.pipe(
      filter(
        ({ modifiedChat }) => !modifiedChat || this.chat.id === modifiedChat.id
      ),
      map(({ chats }) => chats.find(({ id }) => this.chat.id === id))
    );
  }
}
