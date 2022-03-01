import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService extends ApiService {
  private socket: Socket;

  constructor(
    protected http: HttpClient,
    @Inject('webSocketPath') webSocketPath: string
  ) {
    super(http, webSocketPath);
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
