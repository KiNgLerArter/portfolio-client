import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebSocketService } from '@services/web-socket/web-socket.service';
import { Observable } from 'rxjs';
import { Chat, chatDtos } from '../@types/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends WebSocketService {
  constructor(protected http: HttpClient) {
    super(http, 'chat');
  }

  createChat({ name, usersIds }: chatDtos.Create): Observable<Chat> {
    return this.post('create', { name, usersIds });
  }
}
