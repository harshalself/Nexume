import axios from "../lib/axios";

export const signIn = async (email: string, password: string) => {
  // Mock: always succeed
  return Promise.resolve({
    data: {
      user: {
        id: "1",
        email,
        firstName: "Demo",
        lastName: "User",
      },
      token: "mock-token",
    },
  });
};

export const signUp = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  // Mock: always succeed
  return Promise.resolve({
    data: {
      user: {
        id: "1",
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      token: "mock-token",
    },
  });
};
