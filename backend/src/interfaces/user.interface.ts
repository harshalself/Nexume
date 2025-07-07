export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_pic?: string;
  is_deleted?: boolean;
  created_at?: string;
}

export interface IUserSignUpPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface IUserSignInPayload {
  email: string;
  password: string;
}

export interface IUserUpdatePayload {
  first_name?: string;
  last_name?: string;
  profile_pic?: string;
}

export interface IUserResponsePayload {
  user: IUser;
  accessToken: string;
}
