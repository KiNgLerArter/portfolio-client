import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ChatService } from "@entities/chat/services";

@Component({
  selector: "app-send-message",
  templateUrl: "./send-message.component.html",
  styleUrls: ["./send-message.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendMessageComponent implements OnInit {
  @Input() height: string;

  chatControl = new FormControl("", [Validators.maxLength(250)]);

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.init(this.chatControl);
  }

  sendMessage(event?: Event): void {
    event?.preventDefault();
    console.log({
      valid: this.chatControl.valid,
      length: this.chatControl.value?.length
    });
    if (this.chatControl.valid || !this.chatControl.value?.length) {
      this.chatService.sendMessage(this.chatControl.value);
    }
  }
}
