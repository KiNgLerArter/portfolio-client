import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { UntypedFormControl, Validators } from "@angular/forms";
import { ChatsService } from "../../service/chats.service";

@Component({
  selector: "app-chat-actions",
  templateUrl: "./chat-actions.component.html",
  styleUrls: ["./chat-actions.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatActionsComponent implements OnInit {
  @Input() height: string;

  chatControl = new UntypedFormControl("", [Validators.maxLength(250)]);

  constructor(private chatsService: ChatsService) {}

  ngOnInit(): void {
    this.chatsService.setMessagesInput(this.chatControl);
  }

  sendMessage(event?: Event): void {
    event?.preventDefault();
    if (this.chatControl.valid || !this.chatControl.value?.length) {
      this.chatsService.sendMessage(this.chatControl.value);
    }
  }
}
