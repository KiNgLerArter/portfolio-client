import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { ChatActionsComponent } from "./ui/chat-actions/chat-actions.component";
import { ChatsService } from "./services/chats.service";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatListModule } from "@angular/material/list";
import { ChatBodyComponent } from "./ui/chat-body/chat-body.component";
import { ChatHeaderComponent } from "./ui/chat-header/chat-header.component";
import { CreateChatComponent } from "./ui/mat-dialogs/create-chat/create-chat.component";
import { ChatBodyMessageComponent } from "./ui/chat-body/chat-body-message/chat-body-message.component";

const declarationsToExport = [
  ChatBodyComponent,
  ChatActionsComponent,
  ChatHeaderComponent
];

@NgModule({
  declarations: [
    ...declarationsToExport,
    CreateChatComponent,
    ChatBodyMessageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatListModule
  ],
  exports: [...declarationsToExport],
  providers: [ChatsService]
})
export class ChatModule {}
