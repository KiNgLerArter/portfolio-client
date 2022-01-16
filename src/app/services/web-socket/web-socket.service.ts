import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  constructor(@Inject('webSocketPath') webSocketPath: string) {
    this.socket = io(environment.webSocketUrl + webSocketPath);
  }

  protected listen<T>(eventName: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  protected emit<T>(eventName: string, data: T): void {
    this.socket.emit(eventName, data);
  }
}
