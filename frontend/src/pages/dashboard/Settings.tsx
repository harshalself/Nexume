import React, { useState } from "react";
import SettingsForm from "../../components/SettingsForm";
import { useSettings } from "../../hooks/useSettings";
import { SettingsUpdateData } from "../../interfaces/settings.interface";

const Settings = () => {
  const { settings, loading, error, handleUpdate } = useSettings();
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (data: SettingsUpdateData) => {
    await handleUpdate(data);
    setEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground mb-4">
          Manage your provider and API key
        </p>
      </div>
      {settings && (
        <SettingsForm
          settings={settings}
          loading={loading}
          error={error}
          editing={editing}
          setEditing={setEditing}
          onUpdate={handleSave}
          success={success}
        />
      )}
      {!settings && error && <div className="text-red-600">{error}</div>}
    </div>
  );
};

export default Settings;
