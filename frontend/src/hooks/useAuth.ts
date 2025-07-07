import { useState } from "react";
import { signIn, signUp } from "../services/auth.service";

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signIn(email, password);
      setLoading(false);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Sign in failed");
      setLoading(false);
      return null;
    }
  };
  return { handleSignIn, loading, error };
};

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSignUp = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signUp(data);
      setLoading(false);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Sign up failed");
      setLoading(false);
      return null;
    }
  };
  return { handleSignUp, loading, error };
};
