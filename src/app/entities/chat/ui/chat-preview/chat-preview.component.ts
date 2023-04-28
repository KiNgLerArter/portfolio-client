import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { ChatService } from "@entities/chat/services";

@Component({
  selector: "app-chat-preview",
  templateUrl: "./chat-preview.component.html",
  styleUrls: ["./chat-preview.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatPreviewComponent implements OnInit {
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}

  private initSubs(): void {
    this.chatService.listenMessages();
  }
}
