import { SimplifiedUser, User } from "@entities/user";

export enum ChatEvent {
  JOIN = "join chats",
  LEAVE = "leave chats"
}

export enum MessageEvent {
  SEND = "send message",
  DELETE = "delete message",
  RECEIVE = "receive message"
}

export interface Chat {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
}

export interface Message {
  id: string;
  chatId: string;
  owner: User;
  ownerId: number;
  repliedMessageId?: string;
  body: string;
  created_at: number;
}

export interface WSEvent<T> {
  type: ChatEvent | MessageEvent;
  data: T;
}

export class ChatPreview {
  id: string;
  name: string;
  lastMessage: {
    body: Message["body"];
    owner: SimplifiedUser;
  };

  constructor({ id, name }: { id: string; name: string }) {
    this.id = id;
    this.name = name;
  }
}

export type Messages = Record<Chat["id"], Message[]>;
