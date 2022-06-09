import { Chat, message } from './chat.model';

export namespace chatDtos {
  export interface SendMessage {
    readonly chatId: string;
    readonly ownerId: number;
    readonly body: string;
    readonly repliedMessageId?: number;
    readonly sentDate: string;
  }

  export interface CreateChat {
    readonly name: string;
    readonly usersIds: number[];
  }
}
