import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChatService } from "./services";
import { ChatMessageComponent } from "./ui";
import { MatDividerModule } from "@angular/material/divider";

const declarationsToExport = [ChatMessageComponent];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [CommonModule, MatDividerModule],
  exports: [...declarationsToExport],
  providers: [ChatService]
})
export class ChatEntityModule {}
