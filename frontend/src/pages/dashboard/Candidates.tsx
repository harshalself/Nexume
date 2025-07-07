import React, { useState } from "react";
import CandidateFilter from "../../components/CandidateFilter";
import CandidateTable from "../../components/CandidateTable";
import { useCandidates } from "../../hooks/useCandidates";
import { useJobDescriptions } from "../../hooks/useJobDescriptions";
import { Candidate } from "../../interfaces/candidate.interface";
import { Button } from "../../components/ui/button";

const Candidates = () => {
  const {
    candidates,
    loading,
    error,
    selectedJobDescriptionId,
    setSelectedJobDescriptionId,
    emailStatus,
    handleSendEmail,
  } = useCandidates();
  const { jobDescriptions } = useJobDescriptions();
  const [viewCandidate, setViewCandidate] = useState<Candidate | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          Candidates
        </h1>
        <p className="text-muted-foreground mb-4">
          View and manage matched candidates for each job description
        </p>
      </div>
      <CandidateFilter
        jobDescriptions={jobDescriptions}
        selectedId={selectedJobDescriptionId}
        onChange={setSelectedJobDescriptionId}
      />
      {error && <div className="text-red-600">{error}</div>}
      <CandidateTable
        candidates={candidates}
        onViewResume={setViewCandidate}
        onSendEmail={handleSendEmail}
        emailStatus={emailStatus}
        loading={loading}
      />
      {/* Resume View Modal */}
      {viewCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="relative card-hover border-2 border-blue-100 hover:shadow-lg transition-all duration-300 group bg-white p-6 rounded-lg shadow max-w-xl mx-auto">
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2"
              aria-label="Close"
              onClick={() => setViewCandidate(null)}>
              <span className="sr-only">Close</span>×
            </Button>
            <h2 className="text-2xl font-bold mb-2">Resume Preview</h2>
            <div className="mb-2">
              <span className="text-sm text-muted-foreground">Candidate: </span>
              <span className="text-sm font-medium">{viewCandidate.name}</span>
            </div>
            <div className="mb-2">
              <span className="text-sm text-muted-foreground">Email: </span>
              <span className="text-sm">{viewCandidate.email}</span>
            </div>
            <div className="mb-2">
              <span className="text-sm text-muted-foreground">Match: </span>
              <span className="text-sm">{viewCandidate.matchPercentage}%</span>
            </div>
            <div className="mt-4">
              <a
                href={viewCandidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline">
                Download Resume
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
