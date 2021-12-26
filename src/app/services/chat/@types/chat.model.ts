export interface Message {
  id: string;
  userId: string;
  repliedMessageId: string;
  body: string;
  date: number;
}
