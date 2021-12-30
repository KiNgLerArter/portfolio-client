export interface Message {
  id: string;
  userId: string;
  repliedMessageId?: string;
  body: string;
  created_at: number;
}
