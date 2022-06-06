import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from '@services/auth/auth.service';
import { ChatsService } from '../../features/chat/service/chats.service';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isChat: boolean;
  isChatInput: boolean;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout().subscribe();
  }

  toggleChat(): void {
    this.isChat = !this.isChat;
    if (!this.isChat) {
      setTimeout(() => {
        this.isChatInput = false;
      }, 600);
    } else {
      this.isChatInput = true;
    }
  }
}
