import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from "@angular/core";

import { ChatService, Message } from "@entities/chat";

import { ChatMessageEvent } from "../models";

@Component({
  selector: "app-manage-message",
  templateUrl: "./manage-message.component.html",
  styleUrls: ["./manage-message.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageMessageComponent {
  @Input() message: Message;

  @Output() messageEvent = new EventEmitter();

  constructor(private chatService: ChatService) {}

  deleteMessage(): void {
    this.chatService.deleteMessage(this.message);
    this.messageEvent.emit(ChatMessageEvent.DELETE);
  }

  startMessageEditing(): void {}
}
