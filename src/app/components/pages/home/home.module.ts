import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ChatModule } from '@components/features/chat/chat.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, ChatModule],
})
export class HomeModule {}
