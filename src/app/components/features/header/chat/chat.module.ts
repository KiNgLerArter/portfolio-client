import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateChatComponent } from './dialogs/create-chat/create-chat.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChatsService } from './service/chats.service';

const declarationsToExport = [ChatComponent];

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
  ],
  exports: [...declarationsToExport],
  providers: [ChatsService],
})
export class ChatModule {}
