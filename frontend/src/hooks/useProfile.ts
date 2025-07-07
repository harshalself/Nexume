import { useState, useEffect } from "react";
import { IProfile, IProfileUpdateData } from "../interfaces/profile.interface";
import { getProfile, updateProfile } from "../services/profile.service";

export const useProfile = () => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (data: IProfileUpdateData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProfile(data);
      setProfile(updated);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    handleUpdate,
  };
};
