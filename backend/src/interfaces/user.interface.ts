export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_pic?: string;
  is_deleted?: boolean;
  created_at?: string;
  llm_api_key_encrypted?: string;
  llm_api_key_iv?: string;
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
  llm_api_key?: string;
}

export interface IUserResponsePayload {
  user: IUser;
  accessToken: string;
}
