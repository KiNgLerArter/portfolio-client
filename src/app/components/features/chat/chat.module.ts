import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ChatBodyComponent } from './chat-body/chat-body.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { ChatsService } from './service/chats.service';
import { CreateChatComponent } from './mat-dialogs/create-chat/create-chat.component';

const declarationsToExport = [ChatBodyComponent, ChatInputComponent];

@NgModule({
  declarations: [...declarationsToExport, CreateChatComponent],
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
  ],
  exports: [...declarationsToExport],
  providers: [ChatsService],
})
export class ChatModule {}
