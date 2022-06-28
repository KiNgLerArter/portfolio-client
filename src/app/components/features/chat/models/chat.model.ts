import { SimplifiedUser, User } from "@shared/models/users.model";

export enum ChatEvent {
  JOIN = "join chats",
  LEAVE = "leave chats"
}

export enum MessageEvent {
  SEND = "send message",
  DELETE = "delete message",
  RECEIVE = "receive message"
}

export namespace message {
  export interface FE {
    chatId: string;
    ownerId: number;
    repliedMessageId?: string;
    body: string;
    created_at: number;
  }

  export interface BE {
    id: string;
    chatId: string;
    owner: User;
    ownerId: number;
    repliedMessageId?: string;
    body: string;
    created_at: number;
  }
}

export interface Chat {
  id: string;
  name: string;
  users: User[];
  messages: message.BE[];
}

export interface WSEvent<T> {
  type: ChatEvent | MessageEvent;
  data: T;
}

export class ChatPreview {
  id: string;
  name: string;
  lastMessage: {
    body: message.BE["body"];
    owner: SimplifiedUser;
  };

  constructor({ id, name }: { id: string; name: string }) {
    this.id = id;
    this.name = name;
  }
}

export type Messages = Record<Chat["id"], message.BE[]>;
