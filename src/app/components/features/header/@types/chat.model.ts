import { User } from '@shared/@types/users.model';

export namespace message {
  export interface FE {
    chatId: number;
    ownerId: number;
    repliedMessageId?: string;
    body: string;
    created_at: number;
  }

  export interface BE {
    id: string;
    chatId: number;
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
