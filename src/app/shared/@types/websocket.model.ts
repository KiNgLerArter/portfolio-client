export interface WebSocketMessage<T> {
  event: string;
  data: T;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}
