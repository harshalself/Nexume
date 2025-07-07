import { useState, useEffect } from "react";
import { Settings, SettingsUpdateData } from "../interfaces/settings.interface";
import { getSettings, updateSettings } from "../services/settings.service";

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      setError("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async (data: SettingsUpdateData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateSettings(data);
      setSettings(updated);
    } catch (err) {
      setError("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    fetchSettings,
    handleUpdate,
  };
};
