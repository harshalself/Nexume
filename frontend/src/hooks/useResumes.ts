import { useState, useEffect } from "react";
import { Resume, ResumeUploadData } from "../interfaces/resume.interface";
import {
  getResumes,
  uploadResume,
  deleteResume,
} from "../services/resume.service";

export const useResumes = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false); // For upload/fetch
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null); // For per-resume delete

  // Fetch the latest list from the data source
  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getResumes();
      setResumes(data);
    } catch (err) {
      setError("Failed to fetch resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Upload one or more resumes, then re-fetch
  const handleUpload = async (data: ResumeUploadData | ResumeUploadData[]) => {
    setLoading(true);
    setError(null);
    try {
      if (Array.isArray(data)) {
        for (const d of data) {
          await uploadResume(d);
        }
      } else {
        await uploadResume(data);
      }
      await fetchResumes();
    } catch (err) {
      setError("Failed to upload resume(s)");
    } finally {
      setLoading(false);
    }
  };

  // Delete a resume by id, then re-fetch
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError(null);
    try {
      const success = await deleteResume(id);
      if (success) {
        await fetchResumes();
      }
    } catch (err) {
      setError("Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  };

  return {
    resumes,
    loading,
    error,
    deletingId,
    fetchResumes,
    handleUpload,
    handleDelete,
  };
};
