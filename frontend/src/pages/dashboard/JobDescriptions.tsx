import React, { useState } from "react";
import JobDescriptionGrid from "../../components/JobDescriptionGrid";
import JobDescriptionForm from "../../components/JobDescriptionForm";
import JobDescriptionView from "../../components/JobDescriptionView";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useJobDescriptions } from "../../hooks/useJobDescriptions";
import { JD } from "../../services/jobDescription.service";
import { JobDescriptionFormData } from "../../lib/validation";
import { Plus } from "lucide-react";

const JobDescriptions = () => {
  const {
    jobDescriptions,
    loading,
    error,
    handleAdd,
    handleUpdate,
    handleDelete,
  } = useJobDescriptions();

  const [showForm, setShowForm] = useState<{
    mode: "add" | "edit";
    jd: JD | null;
  } | null>(null);
  const [viewJD, setViewJD] = useState<JD | null>(null);
  const [deleteJD, setDeleteJD] = useState<JD | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteJD) handleDelete(deleteJD.id);
    setDeleteJD(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Job Descriptions
          </h1>
          <p className="text-muted-foreground">
            Manage and create job descriptions for candidate matching
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className={`btn-gradient text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all duration-200${
              showForm ? " opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setShowForm({ mode: "add", jd: null })}
            disabled={!!showForm}>
            <Plus className="h-4 w-4" />
            Add Job Description
          </button>
        </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {loading && <div className="text-blue-600">Loading...</div>}

      {/* Show Form (Add/Edit) */}
      {showForm && (
        <div className="mb-6 w-full">
          <JobDescriptionForm
            initialData={showForm.mode === "edit" ? showForm.jd : null}
            onSubmit={(data: JobDescriptionFormData) => {
              if (showForm.mode === "add") handleAdd(data);
              if (showForm.mode === "edit" && showForm.jd)
                handleUpdate(showForm.jd.id, data);
              setShowForm(null);
            }}
            onCancel={() => setShowForm(null)}
          />
        </div>
      )}

      {/* Show View Modal */}
      {viewJD && (
        <JobDescriptionView
          jobDescription={viewJD}
          onClose={() => setViewJD(null)}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteJD}
        title="Delete Job Description"
        description={`Are you sure you want to delete "${deleteJD?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteJD(null)}
      />

      {/* Job Descriptions Grid (hide when form is open) */}
      {!showForm && (
        <JobDescriptionGrid
          jobDescriptions={jobDescriptions}
          onView={setViewJD}
          onEdit={(jd) => setShowForm({ mode: "edit", jd })}
          onDelete={(jdId) => {
            const jd = jobDescriptions.find((j) => j.id === jdId) || null;
            setDeleteJD(jd);
          }}
        />
      )}
    </div>
  );
};

export default JobDescriptions;
