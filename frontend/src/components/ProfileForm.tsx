import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { profileUpdateSchema, ProfileUpdateFormData } from "../lib/validation";

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
    },
  });

  React.useEffect(() => {
    if (!editing) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
      });
    }
  }, [profile, editing, reset]);

  const onSubmit = (data: ProfileUpdateFormData) => {
    // Ensure all fields are strings
    const submitData = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
    };
    onUpdate(submitData);
  };

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    reset({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
    });
    setEditing(false);
  };

  return (
    <form
      className="w-full border-2 border-blue-100 hover:shadow-lg transition-all duration-300 group bg-white p-6 rounded-lg shadow"
      onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">
            Profile updated successfully!
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            {...register("firstName")}
            disabled={!editing}
            className={cn(
              "focus:ring-blue-500 focus:border-blue-500",
              !editing && "bg-gray-50",
              errors.firstName && "border-red-500 focus:ring-red-500"
            )}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            {...register("lastName")}
            disabled={!editing}
            className={cn(
              "focus:ring-blue-500 focus:border-blue-500",
              !editing && "bg-gray-50",
              errors.lastName && "border-red-500 focus:ring-red-500"
            )}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            disabled={!editing}
            className={cn(
              "focus:ring-blue-500 focus:border-blue-500",
              !editing && "bg-gray-50",
              errors.email && "border-red-500 focus:ring-red-500"
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        {editing ? (
          <>
            <Button
              type="submit"
              variant="default"
              disabled={loading || isSubmitting}>
              {loading || isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading || isSubmitting}>
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
