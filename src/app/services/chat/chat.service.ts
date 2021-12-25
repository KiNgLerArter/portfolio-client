import { Inject, Injectable } from '@angular/core';
import {
  WebSocketConfig,
  WebSocketMessage,
} from '@shared/@types/websocket.model';
import { config } from '@shared/configs/websocket.config';
import {
  interval,
  Observable,
  Observer,
  Subject,
  SubscriptionLike,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  share,
  takeWhile,
} from 'rxjs/operators';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // in milliseconds
  private reconnectInterval: number;
  private reconnectAttempts: number;

  // WebSocketSubject configuration object
  private config: WebSocketSubjectConfig<WebSocketMessage<any>>;

  private websocketSub: SubscriptionLike;
  private statusSub: SubscriptionLike;

  // Observable для реконнекта по interval
  private reconnection$: Observable<number>;
  private websocket$: WebSocketSubject<WebSocketMessage<any>>;

  // сообщает, когда происходит коннект и реконнект
  private connection$: Observer<boolean>;

  // вспомогательный Observable для работы с подписками на сообщения
  private messages$: Subject<WebSocketMessage<any>>;

  // синхронный вспомогатель для статуса соединения
  private isConnected: boolean;

  // статус соединения
  status: Observable<boolean>;

  constructor(@Inject(config) private wsConfig: WebSocketConfig) {
    this.messages$ = new Subject<WebSocketMessage<any>>();

    this.reconnectInterval = wsConfig.reconnectInterval || 5000;
    this.reconnectAttempts = wsConfig.reconnectAttempts || 12;

    this.config = {
      url: wsConfig.url,
      closeObserver: {
        next: (event: CloseEvent) => {
          this.websocket$ = null;
          this.connection$.next(false);
        },
      },
      openObserver: {
        next: (event: Event) => {
          console.log('WebSocket connected!');
          this.connection$.next(true);
        },
      },
    };

    // connection status
    this.status = new Observable<boolean>((observer) => {
      this.connection$ = observer;
    }).pipe(share(), distinctUntilChanged());

    // run reconnect if not connection
    this.statusSub = this.status.subscribe((isConnected) => {
      this.isConnected = isConnected;

      if (
        !this.reconnection$ &&
        typeof isConnected === 'boolean' &&
        !isConnected
      ) {
        this.reconnect();
      }
    });

    this.websocketSub = this.messages$.subscribe({
      error: (error) => {
        console.error('WebSocket error!', error);
      },
    });

    this.connect();
  }

  private create(): void {}

  private connect(): void {
    this.websocket$ = new WebSocketSubject(this.config);

    this.websocket$.subscribe(
      (message) => this.messages$.next(message),
      (error: Event) => {
        if (!this.websocket$) {
          // run reconnect if errors
          this.reconnect();
        }
      }
    );
  }

  /*
   * reconnect if not connecting or errors
   * */
  private reconnect(): void {
    this.reconnection$ = interval(this.reconnectInterval).pipe(
      takeWhile(
        (v, index) => index < this.reconnectAttempts && !this.websocket$
      )
    );

    this.reconnection$.subscribe({
      next: () => this.connect(),
      complete: () => {
        // Subject complete if reconnect attemts ending
        this.reconnection$ = null;

        if (!this.websocket$) {
          this.messages$.complete();
          this.connection$.complete();
        }
      },
    });
  }

  public on<T>(event: string): Observable<T> | void {
    if (event) {
      return this.messages$.pipe(
        filter((message: WebSocketMessage<T>) => message.event === event),
        map((message: WebSocketMessage<T>) => message.data)
      );
    }
  }

  /*
   * on message to server
   * */
  public send(event: string, data: any = {}): void {
    if (event && this.isConnected) {
      this.websocket$.next(<any>JSON.stringify({ event, data }));
    } else {
      console.error('Send error!');
    }
  }
}
