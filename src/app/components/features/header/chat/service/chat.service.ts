import { Injectable } from '@angular/core';
import { WebSocketService } from '@services/web-socket/web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends WebSocketService {
  constructor() {
    super('chat');
  }
}
