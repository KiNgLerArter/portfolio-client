import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from '@services/auth/auth.service';
import { ChatsService } from './services/chats/chats.service';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isChat: boolean;
  isChatInput: boolean;
  chatControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(250),
  ]);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  constructor(
    private authService: AuthService,
    private chatsService: ChatsService
  ) {}

  ngOnInit(): void {
    this.chatsService.listenMessages().subscribe();
  }

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

  sendMessage(): void {
    if (this.chatControl.valid) {
      this.chatsService.sendMessage(this.chatControl.value);
    }
  }
}
