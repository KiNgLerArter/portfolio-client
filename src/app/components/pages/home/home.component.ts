import { Component, OnInit } from '@angular/core';
import { Message } from '@services/chat/@types/chat.model';
import { ChatService } from '@services/chat/chat.service';
import { Observable } from 'rxjs';
import * as uuid from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  messages$: Observable<Message>;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.messages$ =
      this.chatService.listen<Message>('messageToClient') || null;
    // this.messages$ = this.chatService.listen<Message[]>('messageToClient') || null;

    this.messages$.subscribe((messages) => {
      console.log('[messages]:', messages);
    });

    this.chatService.emit<Message>('messageToServer', {
      id: uuid.v4(),
      userId: '1',
      body: 'test message',
      created_at: Date.now(),
    });
  }
}
