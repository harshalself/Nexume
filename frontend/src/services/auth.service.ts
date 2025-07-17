import axios from "../lib/axios";

function mapUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
  };
}

export const signUp = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const payload = {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    password: data.password,
  };
  const res = await axios.post("/auth/signup", payload);
  return {
    ...res.data,
    user: mapUser(res.data.user),
  };
};

export const signIn = async (email: string, password: string) => {
  const res = await axios.post("/auth/signin", { email, password });
  return {
    ...res.data,
    user: mapUser(res.data.user),
  };
};

export const getProfile = async () => {
  const res = await axios.get("/auth/profile");
  return {
    ...res.data,
    user: mapUser(res.data.user),
  };
};

export const updateProfile = async (data: {
  firstName?: string;
  lastName?: string;
  email?: string;
}) => {
  // Map camelCase to snake_case for update
  const payload: any = {};
  if (data.firstName !== undefined) payload.first_name = data.firstName;
  if (data.lastName !== undefined) payload.last_name = data.lastName;
  if (data.email !== undefined) payload.email = data.email;
  const res = await axios.patch("/auth/profile", payload);
  return {
    ...res.data,
    user: mapUser(res.data.user),
  };
};

export const deleteProfile = async () => {
  const res = await axios.delete("/auth/profile");
  return res.data;
};
