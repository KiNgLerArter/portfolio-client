import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebSocketService } from '@services/web-socket/web-socket.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService extends WebSocketService {
  constructor(protected http: HttpClient) {
    super(http, 'chat');
  }

  sendMessage(): Observable<void> {
    return this;
  }
}
