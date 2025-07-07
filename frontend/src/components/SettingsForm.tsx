import React, { useState } from "react";
import { Settings, SettingsUpdateData } from "../interfaces/settings.interface";
import { Button } from "./ui/button";

const PROVIDERS = [
  { label: "Gemini", value: "Gemini" },
  { label: "OpenAI", value: "OpenAI" },
  { label: "Anthropic", value: "Anthropic" },
  { label: "Cohere", value: "Cohere" },
];

type Props = {
  settings: Settings;
  loading: boolean;
  error: string | null;
  editing: boolean;
  setEditing: (v: boolean) => void;
  onUpdate: (data: SettingsUpdateData) => void;
  success: boolean;
};

const SettingsForm: React.FC<Props> = ({
  settings,
  loading,
  error,
  editing,
  setEditing,
  onUpdate,
  success,
}) => {
  const [form, setForm] = useState<SettingsUpdateData>({
    provider: settings.provider,
    apiKey: settings.apiKey,
  });

  React.useEffect(() => {
    if (!editing) {
      setForm({
        provider: settings.provider,
        apiKey: settings.apiKey,
      });
    }
  }, [settings, editing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(form);
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setForm({ provider: settings.provider, apiKey: settings.apiKey });
    setEditing(false);
  };

  return (
    <form
      className="card-hover border-2 border-blue-100 hover:shadow-lg transition-all duration-300 group w-full bg-white p-6 rounded-lg shadow"
      onSubmit={handleSubmit}>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm mb-2">
          Settings updated successfully!
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="provider" className="block text-sm font-medium mb-1">
          Provider
        </label>
        <select
          id="provider"
          name="provider"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={form.provider}
          onChange={handleChange}
          disabled={!editing}
          required>
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
          API Key
        </label>
        <input
          id="apiKey"
          name="apiKey"
          type="text"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={form.apiKey}
          onChange={handleChange}
          disabled={!editing}
          required
        />
      </div>
      <div className="flex gap-2 mt-4">
        {editing ? (
          <>
            <Button type="submit" variant="default" disabled={loading}>
              Save
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}>
              Cancel
            </Button>
          </>
        ) : (
          <Button type="button" variant="default" onClick={handleEdit}>
            Edit
          </Button>
        )}
      </div>
    </form>
  );
};

export default SettingsForm;
