import { User } from '@shared/@types/users.model';

export interface Message {
  ownerId: number;
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
