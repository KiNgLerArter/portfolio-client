export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  nickname: string;
  isBanned: boolean;
  isActivated: boolean;
  banReason: string;
  roles: UserRole[];
  chatsIds: string[];
}

export interface SimplifiedUser {
  id: number;
  nickname: string;
}

export interface UserRole {
  id: number;
  createdAt: string;
  updatedAt: string;
  value: string;
  description: string;
}
