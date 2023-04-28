import { Chat } from "../models";

export const getChatById = (id: Chat["id"], chats: Chat[]): Chat =>
  chats.find((chat) => chat.id === id);
