import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  jobDescriptionSchema,
  JobDescriptionFormData,
} from "../lib/validation";
import { JD } from "../services/jobDescription.service";

interface Props {
  initialData: JD | null;
  onSubmit: (data: JobDescriptionFormData) => void;
  onCancel: () => void;
}

const JobDescriptionForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobDescriptionFormData>({
    resolver: zodResolver(jobDescriptionSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      company: "",
      location: "",
      requirements: "",
      status: initialData?.status || "Active",
    },
  });

  const handleFormSubmit = (data: JobDescriptionFormData) => {
    onSubmit(data);
  };

  return (
    <form
      className="card-hover border-2 border-blue-100 hover:shadow-lg transition-all duration-300 group w-full bg-white p-6 rounded-lg shadow"
      onSubmit={handleSubmit(handleFormSubmit)}>
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? "Edit Job Description" : "Add Job Description"}
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g. Senior Frontend Developer"
              {...register("title")}
              className={cn(
                "focus:ring-blue-500 focus:border-blue-500",
                errors.title && "border-red-500 focus:ring-red-500"
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              type="text"
              placeholder="e.g. Tech Company Inc."
              {...register("company")}
              className={cn(
                "focus:ring-blue-500 focus:border-blue-500",
                errors.company && "border-red-500 focus:ring-red-500"
              )}
            />
            {errors.company && (
              <p className="text-red-500 text-sm">{errors.company.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g. New York, NY / Remote"
              {...register("location")}
              className={cn(
                "focus:ring-blue-500 focus:border-blue-500",
                errors.location && "border-red-500 focus:ring-red-500"
              )}
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <select
              id="status"
              {...register("status")}
              className={cn(
                "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white",
                errors.status && "border-red-500 focus:ring-red-500"
              )}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            rows={6}
            {...register("description")}
            className={cn(
              "focus:ring-blue-500 focus:border-blue-500",
              errors.description && "border-red-500 focus:ring-red-500"
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements *</Label>
          <Textarea
            id="requirements"
            placeholder="List the required skills, experience, and qualifications..."
            rows={4}
            {...register("requirements")}
            className={cn(
              "focus:ring-blue-500 focus:border-blue-500",
              errors.requirements && "border-red-500 focus:ring-red-500"
            )}
          />
          {errors.requirements && (
            <p className="text-red-500 text-sm">
              {errors.requirements.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          type="submit"
          variant="default"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700">
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Job"
            : "Create Job"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default JobDescriptionForm;
