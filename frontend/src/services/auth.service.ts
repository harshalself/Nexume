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
  try {
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
  } catch (error: any) {
    console.error("Sign up error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create account"
    );
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const res = await axios.post("/auth/signin", { email, password });
    return {
      ...res.data,
      user: mapUser(res.data.user),
    };
  } catch (error: any) {
    console.error("Sign in error:", error);
    if (error.response?.status === 401) {
      throw new Error("Invalid email or password");
    }
    throw new Error(error.response?.data?.message || "Failed to sign in");
  }
};

export const getProfile = async () => {
  try {
    const res = await axios.get("/auth/profile");
    return {
      ...res.data,
      user: mapUser(res.data.user),
    };
  } catch (error: any) {
    console.error("Get profile error:", error);
    if (error.response?.status === 401) {
      throw new Error("Please sign in to access your profile");
    }
    throw new Error("Failed to fetch profile");
  }
};

export const updateProfile = async (data: {
  firstName?: string;
  lastName?: string;
  email?: string;
}) => {
  try {
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
  } catch (error: any) {
    console.error("Update profile error:", error);
    if (error.response?.status === 401) {
      throw new Error("Please sign in to update your profile");
    }
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};

export const deleteProfile = async () => {
  try {
    const res = await axios.delete("/auth/profile");
    return res.data;
  } catch (error: any) {
    console.error("Delete profile error:", error);
    if (error.response?.status === 401) {
      throw new Error("Please sign in to delete your account");
    }
    throw new Error("Failed to delete account");
  }
};
