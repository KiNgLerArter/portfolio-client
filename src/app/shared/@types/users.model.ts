import { Role } from './roles.model';

export interface User {
  id: number;
  email: string;
  isBanned: boolean;
  isActivated: boolean;
  banReason: string;
  roles: Role[];
  chatsIds: string[];
}
