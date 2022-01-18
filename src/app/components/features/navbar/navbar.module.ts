import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { ChatModule } from './chat/chat.module';

@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, ChatModule],
  exports: [NavbarComponent],
})
export class NavbarModule {}
