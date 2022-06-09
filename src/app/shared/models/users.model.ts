import { NicknameFieldComponent } from '@components/entities/form-fields/nickname-field/nickname-field.component';
import { Role } from './roles.model';

export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  nickname: string;
  isBanned: boolean;
  isActivated: boolean;
  banReason: string;
  roles: Role[];
  chatsIds: string[];
}

export interface SimplifiedUser {
  id: number;
  nickname: string;
}
