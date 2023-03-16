import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { CreateChatDialogComponent } from "./create-chat-dialog";

@Component({
  selector: "app-create-chat",
  templateUrl: "./create-chat.component.html",
  styleUrls: ["./create-chat.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateChatComponent {
  constructor(private dialog: MatDialog) {}

  openCreateChatDialog(): void {
    this.dialog.open(CreateChatDialogComponent, { width: "400px" });
  }
}
