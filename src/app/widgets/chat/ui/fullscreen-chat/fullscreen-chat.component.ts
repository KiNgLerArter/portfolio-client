import { ChangeDetectionStrategy, Component } from "@angular/core";

import { ChatService } from "@entities/chat";

@Component({
  selector: "app-fullscreen-chat",
  templateUrl: "./fullscreen-chat.component.html",
  styleUrls: ["./fullscreen-chat.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullscreenChatComponent {
  constructor(protected chatService: ChatService) {}
}
