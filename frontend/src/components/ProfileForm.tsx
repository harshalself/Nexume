import React from "react";
import { Button } from "./ui/button";

type ProfileFormProps = {
  profile: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
  loading: boolean;
  error: string | null;
  editing: boolean;
  setEditing: (v: boolean) => void;
  onUpdate: (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
  success: boolean;
};

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  loading,
  error,
  editing,
  setEditing,
  onUpdate,
  success,
}) => {
  const [form, setForm] = React.useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
  });

  React.useEffect(() => {
    if (!editing) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
      });
    }
  }, [profile, editing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(form);
  };

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setForm({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
    });
    setEditing(false);
  };

  return (
    <form
      className="w-full border-2 border-blue-100 hover:shadow-lg transition-all duration-300 group bg-white p-6 rounded-lg shadow"
      onSubmit={handleSubmit}>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm mb-2">
          Profile updated successfully!
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-sm font-medium mb-1">
          First Name
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={form.firstName}
          onChange={handleChange}
          disabled={!editing}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="lastName" className="block text-sm font-medium mb-1">
          Last Name
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={form.lastName}
          onChange={handleChange}
          disabled={!editing}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={form.email}
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

export default ProfileForm;
