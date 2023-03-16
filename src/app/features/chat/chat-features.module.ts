import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

import { ChatEntityModule } from "@entities/chat/chat-entity.module";

import { CreateChatComponent, CreateChatDialogComponent } from "./create-chat";
import { ManageMessageComponent } from "./manage-message";
import { SendMessageComponent } from "./send-message";

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
