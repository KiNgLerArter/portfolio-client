export type SendMessageDTO = Readonly<{
  chatId: string;
  ownerId: number;
  body: string;
  repliedMessageId?: number;
  sentDate: string;
}>;

export type CreateChatDTO = Readonly<{
  name: string;
  usersIds: number[];
}>;
