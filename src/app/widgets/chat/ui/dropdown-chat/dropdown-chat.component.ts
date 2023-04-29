import { ChangeDetectionStrategy, Component } from "@angular/core";

import { ChatService } from "@entities/chat";

@Component({
  selector: "app-dropdown-chat",
  templateUrl: "./dropdown-chat.component.html",
  styleUrls: ["./dropdown-chat.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownChatComponent {
  constructor(protected chatService: ChatService) {}
}
