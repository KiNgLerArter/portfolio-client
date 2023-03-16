import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";

import { ChatService } from "./services";
import { ChatMessageComponent } from "./ui";

const declarationsToExport = [ChatMessageComponent];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [CommonModule, MatDividerModule],
  exports: [...declarationsToExport],
  providers: [ChatService]
})
export class ChatEntityModule {}
