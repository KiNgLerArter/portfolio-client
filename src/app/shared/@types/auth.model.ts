export interface UserDto {
  email: string;
  password: string;
}

export interface AuthRes {
  accessToken: string;
  user: {
    id: number;
    email: string;
  };
}

export enum Auth {
  accessToken = 'ACCESS_TOKEN',
}
