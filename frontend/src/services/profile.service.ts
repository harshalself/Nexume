import { IProfile } from "../interfaces/profile.interface";

let mockProfile: IProfile = {
  firstname: "John",
  lastname: "Doe",
  email: "john.doe@example.com",
  password: "password",
};

export const getProfile = async (): Promise<IProfile> => {
  return { ...mockProfile };
};

export const updateProfile = async (
  data: Partial<IProfile>
): Promise<IProfile> => {
  mockProfile = { ...mockProfile, ...data };
  return { ...mockProfile };
};
