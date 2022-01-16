export interface Message {
  userId: number;
  repliedMessageId?: string;
  body: string;
  created_at: number;
}

export interface GroupMessage extends Message {
  groupId: string;
}
