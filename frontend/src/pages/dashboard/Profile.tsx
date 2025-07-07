import React, { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import ProfileForm from "../../components/ProfileForm";

const Profile: React.FC = () => {
  const { profile, loading, error, success, handleUpdate } = useProfile();
  const [editing, setEditing] = useState(false);

  if (!profile) {
    return <div className="p-6">Loading...</div>;
  }

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
        profile={profile}
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
