import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-fullscreen-chat",
  templateUrl: "./fullscreen-chat.component.html",
  styleUrls: ["./fullscreen-chat.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullscreenChatComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
