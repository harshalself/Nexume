import React, { useRef, useState } from "react";
import { ResumeUploadData } from "../interfaces/resume.interface";
import { Button } from "./ui/button";

type Props = {
  onUpload: (data: ResumeUploadData) => void;
  loading: boolean;
};

const ResumeUploadForm: React.FC<Props> = ({ onUpload, loading }) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }
    const invalid = Array.from(files).find(
      (file) => !/(pdf|docx)$/i.test(file.name.split(".").pop() || "")
    );
    if (invalid) {
      setError("Only PDF and DOCX files are allowed.");
      return;
    }
    setError(null);
    Array.from(files).forEach((file) => onUpload({ file }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form
      className="card-hover border-2 border-blue-100 hover:shadow-lg transition-all duration-300 group w-full bg-white p-6 rounded-lg shadow mb-6"
      onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2">Upload Resume</h2>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          multiple
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          aria-label="Resume file upload"
          disabled={loading}
        />
        <Button type="submit" variant="default" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </form>
  );
};

export default ResumeUploadForm;
