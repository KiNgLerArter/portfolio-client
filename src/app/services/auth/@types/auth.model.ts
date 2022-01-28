export interface UserDto {
  email: string;
  password: string;
}

export interface AuthRes {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    isActivated: boolean;
    isBanned: boolean;
  };
}

export enum Auth {
  accessToken = 'ACCESS_TOKEN',
}
