import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { ChatService } from "@entities/chat/services";

@Component({
  selector: "app-send-message",
  templateUrl: "./send-message.component.html",
  styleUrls: ["./send-message.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendMessageComponent {
  @Input() height: string;

  chatControl = this.chatService.getInput();

  constructor(private chatService: ChatService) {}

  sendMessage(event?: Event): void {
    event?.preventDefault();
    if (this.chatControl.valid || !this.chatControl.value?.length) {
      this.chatService.sendMessage(this.chatControl.value);
    }
  }
}
