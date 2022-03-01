import { User } from '@shared/@types/users.model';

export namespace chatDtos {
  export interface Create {
    readonly name: string;
    readonly usersIds: number[];
  }
}

export interface Message {
  userId: number;
  repliedMessageId?: string;
  body: string;
  created_at: number;
}

export interface GroupMessage extends Message {
  groupId: string;
}

export interface Chat {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
}
