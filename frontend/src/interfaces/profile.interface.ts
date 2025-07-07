export interface IProfile {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface IProfileUpdateData {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
}
