import { ComponentRef } from "@angular/core";

import { User } from "@entities/user";
import { LimitedArray } from "@shared/utils";

import { msgsPreviewLimit } from "../configs";

export enum ChatEvent {
  JOIN = "join chats",
  LEAVE = "leave chats"
}

export enum MessageEvent {
  SEND = "send message",
  DELETE = "delete message",
  RECEIVE = "receive message"
}

export enum ChatViewType {
  FULL = "fullscreen",
  DROP = "dropdown"
}

export type ChatView<T> = { type: ChatViewType; component?: ComponentRef<T> };

// export namespace Chat {
//   export class FE {
//     id: string;
//     name: string;
//     users: User[];
//     messages: Record<Message["id"], Message>;

//     constructor({ id, name, users, messages }: Chat.BE) {
//       this.id = id;
//       this.name = name;
//       this.users = users;
//       this.messages = messages?.reduce((acc, message) => {
//         acc[message.id] = message;
//         return acc;
//       }, {} as Chat.FE["messages"]);
//     }
//   }

//   export class BE {
//     id: string;
//     name: string;
//     users: User[];
//     messages: Message[];

//     constructor({ id, name, users, messages }: Chat.FE) {
//       this.id = id;
//       this.name = name;
//       this.users = users;
//       this.messages = Object.values(messages);
//     }
//   }
// }

export class Chat {
  id: string;
  name: string;
  users: User[];
  messages?: Message[];

  constructor({ id, name, users, messages }: Chat) {
    this.id = id;
    this.name = name;
    this.users = users;
    this.messages = messages;
  }
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

export type ChatPreviewMessages = LimitedArray<Message, 25>;

export class ChatPreview {
  id: string;
  name: string;
  users: User[];
  private _messages?: ChatPreviewMessages;

  get messages(): Readonly<ChatPreviewMessages> {
    return this._messages;
  }

  constructor({
    id,
    name,
    users,
    messages
  }: {
    id: string;
    name: string;
    users: User[];
    messages?: Message[];
  }) {
    this.id = id;
    this.name = name;
    this.users = users;
    this.setMessages(messages);
  }

  setMessages(msgs: Message[]): void {
    if (msgs.length > msgsPreviewLimit) {
      msgs.slice(-msgsPreviewLimit);
    }
    this._messages = msgs as ChatPreviewMessages;
  }

  addMessage(message: Message): void {
    if (this._messages?.length === msgsPreviewLimit) {
      this._messages.splice(0, 1);
    }
    this._messages.push(message);
  }

  deleteMessage(messageId: Message["id"]): void {
    const indexToDelete = this._messages.findIndex(
      (message) => message.id === messageId
    );
    this._messages.splice(indexToDelete, 1);
  }
}
