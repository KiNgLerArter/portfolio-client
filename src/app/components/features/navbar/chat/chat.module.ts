import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

const declarationsToExport = [ChatComponent];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [...declarationsToExport],
})
export class ChatModule {}
