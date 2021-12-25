import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';

const declarationsToExport = [ChatComponent];

@NgModule({
  declarations: [...declarationsToExport],
  imports: [CommonModule],
  exports: [...declarationsToExport],
})
export class FeaturesModule {}
