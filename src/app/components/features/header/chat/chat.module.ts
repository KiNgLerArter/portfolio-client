import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const declarationsToExport = [ChatComponent];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [CommonModule, MatTooltipModule, FormsModule, ReactiveFormsModule],
  exports: [...declarationsToExport],
})
export class ChatModule {}