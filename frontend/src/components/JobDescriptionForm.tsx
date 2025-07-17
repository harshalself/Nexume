import React, { useState } from "react";
import { JD, JDFormData, JobStatus } from "../services/jobDescription.service";
import { Button } from "./ui/button";

const JOB_STATUS_OPTIONS: JobStatus[] = ["Active", "Inactive"];

interface Props {
  initialData: JD | null;
  onSubmit: (data: JDFormData) => void;
  onCancel: () => void;
}

const JobDescriptionForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [status, setStatus] = useState<JobStatus>(
    initialData?.status || JOB_STATUS_OPTIONS[0]
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !status) {
      setError("Title, description, and status are required.");
      return;
    }
    setError(null);
    onSubmit({ title: title.trim(), description: description.trim(), status });
  };

  return (
    <form
      className="card-hover border-2 border-blue-100 hover:shadow-lg transition-all duration-300 group w-full bg-white p-6 rounded-lg shadow"
      onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2">
        {initialData ? "Edit Job Description" : "Add Job Description"}
      </h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          aria-required="true"
          rows={4}
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status
        </label>
        <select
          id="status"
          aria-label="Job status"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400 bg-white"
          value={status}
          onChange={(e) => setStatus(e.target.value as JobStatus)}
          required
          aria-required="true">
          {JOB_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 mt-4">
        <Button type="submit" variant="default">
          {initialData ? "Update" : "Add"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default JobDescriptionForm;
