import React, { useState } from "react";
import ResumeUploadForm from "../../components/ResumeUploadForm";
import ResumeList from "../../components/ResumeList";
import { useResumes } from "../../hooks/useResumes";
import { Resume } from "../../interfaces/resume.interface";
import { Button } from "../../components/ui/button";

const ResumeUpload = () => {
  const { resumes, loading, error, handleUpload, handleDelete, deletingId } =
    useResumes();
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          Resume Upload
        </h1>
        <p className="text-muted-foreground mb-4">
          Upload resumes and manage your candidate documents
        </p>
      </div>
      <ResumeUploadForm onUpload={handleUpload} loading={loading} />
      {error && <div className="text-red-600">{error}</div>}
      <ResumeList
        resumes={resumes}
        onDelete={handleDelete}
        onView={setSelectedResume}
        loading={loading}
        deletingId={deletingId}
      />
      {/* View Modal */}
      {selectedResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="relative card-hover border-2 border-blue-100 hover:shadow-lg transition-all duration-300 group bg-white p-6 rounded-lg shadow max-w-xl mx-auto">
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2"
              aria-label="Close"
              onClick={() => setSelectedResume(null)}>
              <span className="sr-only">Close</span>×
            </Button>
            <h2 className="text-2xl font-bold mb-2">Resume Details</h2>
            <div className="mb-2">
              <span className="text-sm text-muted-foreground">Filename: </span>
              <span className="text-sm font-medium">
                {selectedResume.filename}
              </span>
            </div>
            <div className="mb-2">
              <span className="text-sm text-muted-foreground">Uploaded: </span>
              <span className="text-sm">{selectedResume.uploadedAt}</span>
            </div>
            <div className="mb-2">
              <span className="text-sm text-muted-foreground">Status: </span>
              <span className="text-sm">{selectedResume.status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
