import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isChat: boolean;
  isChatInput: boolean;
  chatControl = new FormControl('', [Validators.maxLength(250)]);

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
