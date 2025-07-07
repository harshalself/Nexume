import { useState, useEffect } from "react";
import { Candidate } from "../interfaces/candidate.interface";
import {
  getCandidates,
  sendEmailToCandidate,
} from "../services/candidate.service";

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobDescriptionId, setSelectedJobDescriptionId] = useState<
    number | null
  >(null);
  const [emailStatus, setEmailStatus] = useState<
    Record<number, "idle" | "sending" | "sent" | "error">
  >({});

  const fetchCandidates = async (jobDescriptionId?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCandidates(jobDescriptionId);
      setCandidates(data);
    } catch (err) {
      setError("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(selectedJobDescriptionId || undefined);
  }, [selectedJobDescriptionId]);

  const handleSendEmail = async (candidateId: number) => {
    setEmailStatus((prev) => ({ ...prev, [candidateId]: "sending" }));
    setError(null);
    try {
      await sendEmailToCandidate(candidateId);
      setEmailStatus((prev) => ({ ...prev, [candidateId]: "sent" }));
      setTimeout(() => {
        setEmailStatus((prev) => ({ ...prev, [candidateId]: "idle" }));
      }, 2000);
    } catch (err) {
      setEmailStatus((prev) => ({ ...prev, [candidateId]: "error" }));
      setTimeout(() => {
        setEmailStatus((prev) => ({ ...prev, [candidateId]: "idle" }));
      }, 2000);
      setError("Failed to send email");
    }
  };

  return {
    candidates,
    loading,
    error,
    selectedJobDescriptionId,
    setSelectedJobDescriptionId,
    emailStatus,
    fetchCandidates,
    handleSendEmail,
  };
};
