import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { ChatEntityModule } from "@entities/chat/chat-entity.module";
import { SendMessageComponent } from "./send-message";
import { CreateChatComponent } from "./create-chat";
import { ManageMessageComponent } from "./manage-message";
import { MatDividerModule } from "@angular/material/divider";
import { MatSelectModule } from "@angular/material/select";
import { CreateChatDialogComponent } from "./create-chat";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

const declarationsToExport = [
  SendMessageComponent,
  CreateChatComponent,
  CreateChatDialogComponent,
  ManageMessageComponent
];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    ChatEntityModule
  ],
  exports: [...declarationsToExport, ChatEntityModule]
})
export class ChatFeaturesModule {}
