import { useState, useEffect } from "react";
import { JD, JDFormData } from "../services/jobDescription.service";
import {
  getJobDescriptions,
  addJobDescription,
  updateJobDescription,
  deleteJobDescription,
} from "../services/jobDescription.service";

export const useJobDescriptions = () => {
  const [jobDescriptions, setJobDescriptions] = useState<JD[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For future: add pagination/filtering state here
  // const [page, setPage] = useState(1);
  // const [filter, setFilter] = useState<string>("");

  const fetchJobDescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      // For future: pass pagination/filter params to service here
      const data = await getJobDescriptions();
      setJobDescriptions(data);
    } catch (err) {
      setError("Failed to fetch job descriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDescriptions();
  }, []);

  const handleAdd = async (data: JDFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newJD = await addJobDescription(data);
      setJobDescriptions((prev) => [...prev, newJD]);
    } catch (err) {
      setError("Failed to add job description");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, data: JDFormData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateJobDescription(id, data);
      if (updated) {
        setJobDescriptions((prev) =>
          prev.map((jd) => (jd.id === id ? updated : jd))
        );
      }
    } catch (err) {
      setError("Failed to update job description");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteJobDescription(id);
      if (success) {
        setJobDescriptions((prev) => prev.filter((jd) => jd.id !== id));
      }
    } catch (err) {
      setError("Failed to delete job description");
    } finally {
      setLoading(false);
    }
  };

  return {
    jobDescriptions,
    loading,
    error,
    fetchJobDescriptions,
    handleAdd,
    handleUpdate,
    handleDelete,
    // For future: expose pagination/filter setters here
  };
};
