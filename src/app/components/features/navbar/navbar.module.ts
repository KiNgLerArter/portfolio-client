import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { ChatModule } from './chat/chat.module';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    ChatModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
  ],
  exports: [NavbarComponent],
})
export class NavbarModule {}
