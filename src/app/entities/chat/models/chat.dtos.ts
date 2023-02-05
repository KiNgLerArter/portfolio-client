export namespace chatDtos {
  export type SendMessage = Readonly<{
    chatId: string;
    ownerId: number;
    body: string;
    repliedMessageId?: number;
    sentDate: string;
  }>;

  export type CreateChat = Readonly<{
    name: string;
    usersIds: number[];
  }>;
}
