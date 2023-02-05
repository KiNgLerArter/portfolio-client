import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { message } from "../../../models";

@Component({
  selector: "app-chat-body-message",
  templateUrl: "./chat-body-message.component.html",
  styleUrls: ["./chat-body-message.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBodyMessageComponent {
  @Input() message: message.BE;
}
