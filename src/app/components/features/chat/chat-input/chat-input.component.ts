import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ChatsService } from '../service/chats.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
})
export class ChatInputComponent implements OnInit {
  chatControl = new FormControl('', [Validators.maxLength(250)]);

  constructor(private chatsService: ChatsService) {}

  ngOnInit(): void {
    this.chatsService.messageInput = this.chatControl;
  }

  sendMessage(event?: Event): void {
    event?.preventDefault();
    if (this.chatControl.valid || !this.chatControl.value?.length) {
      this.chatsService.sendMessage(this.chatControl.value);
    }
  }
}
