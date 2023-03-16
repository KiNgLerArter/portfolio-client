import { BehaviorSubject } from "rxjs";

import { Chat, ChatPreview } from "../models";

export class ChatServiceStub {
  private _userChats$ = new BehaviorSubject<ChatPreview[]>([]);
  private _currentChat$ = new BehaviorSubject<Chat>(null);

  userChats$ = this._userChats$.asObservable();
  currentChat$ = this._currentChat$.asObservable();
}
