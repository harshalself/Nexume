import React, { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import ProfileForm from "../../components/ProfileForm";

const Profile: React.FC = () => {
  const { user, loading, error, handleUpdateProfile } = useAuthContext();
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return <div className="p-6">Loading...</div>;
  }

  const handleUpdate = async (data: any) => {
    await handleUpdateProfile(data);
    setEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          Profile
        </h1>
        <p className="text-muted-foreground mb-4">
          Manage your personal information
        </p>
      </div>
      <ProfileForm
        profile={user}
        loading={loading}
        error={error}
        editing={editing}
        setEditing={setEditing}
        onUpdate={handleUpdate}
        success={success}
      />
    </div>
  );
};

export default Profile;
