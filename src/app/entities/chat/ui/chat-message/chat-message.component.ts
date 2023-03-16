import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Message } from "../../models";

@Component({
  selector: "app-chat-message",
  templateUrl: "./chat-message.component.html",
  styleUrls: ["./chat-message.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageComponent {
  @Input() message: Message;
}
