import { BehaviorSubject } from "rxjs";

import { Chat, ChatPreview, ChatView, ChatViewType } from "../models";

export class ChatServiceStub {
  userChats$ = new BehaviorSubject<{
    chats?: ChatPreview[];
    modifiedChat?: ChatPreview;
  }>({}).asObservable();
  currentChat$ = new BehaviorSubject<Chat>(null).asObservable();
  view$ = new BehaviorSubject<ChatView<any>>({
    type: ChatViewType.DROP
  }).asObservable();
}
