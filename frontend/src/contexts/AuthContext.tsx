import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signUp as apiSignUp,
  signIn as apiSignIn,
  getProfile as apiGetProfile,
  updateProfile as apiUpdateProfile,
  deleteProfile as apiDeleteProfile,
} from "../services/auth.service";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  handleSignUp: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  handleSignIn: (email: string, password: string) => Promise<boolean>;
  handleSignOut: () => void;
  handleGetProfile: () => Promise<void>;
  handleUpdateProfile: (
    data: Partial<User> & { password?: string }
  ) => Promise<void>;
  handleDeleteProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSignUp = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiSignUp(data);
      setUser(res.user);
      setToken(res.accessToken);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("accessToken", res.accessToken);
    } catch (err: any) {
      setError(err.message || "Sign up failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiSignIn(email, password);
      setUser(res.user);
      setToken(res.accessToken);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("accessToken", res.accessToken);
      return true;
    } catch (err: any) {
      setError(err.message || "Sign in failed");
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const handleGetProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetProfile();
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (
    data: Partial<User> & { password?: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiUpdateProfile(data);
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiDeleteProfile();
      handleSignOut();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        handleSignUp,
        handleSignIn,
        handleSignOut,
        handleGetProfile,
        handleUpdateProfile,
        handleDeleteProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
