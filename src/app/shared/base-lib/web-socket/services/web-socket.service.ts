import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ApiService } from "@shared/base-lib/api";
import { Observable } from "rxjs";
import { io, Socket } from "socket.io-client";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class WebSocketService extends ApiService {
  private socket: Socket;

  constructor(
    protected http: HttpClient,
    @Inject("webSocketPath") webSocketPath: string
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

  /**
   *
   * @param eventName websocket event name
   * @param data data passed to BE
   * @param callback callback which will be called on the BE
   */

  protected emit<T>(eventName: string, data: T, callback?: () => void): void {
    if (callback) {
      this.socket.emit(eventName, data, callback);
    } else {
      this.socket.emit(eventName, data);
    }
  }
}
