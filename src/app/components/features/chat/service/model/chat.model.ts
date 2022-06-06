import { User } from '@shared/model/users.model';

export enum ChatEvents {
  JOIN = 'join chat',
  LEAVE = 'leave chat',
}

export enum MessageEvents {
  SEND = 'send message',
  DELETE = 'delete message',
  RECEIVE = 'receive message',
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
}

export type Messages = Record<Chat['id'], message.BE[]>;
