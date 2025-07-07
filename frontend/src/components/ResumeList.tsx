import React from "react";
import { Resume } from "../interfaces/resume.interface";
import { Button } from "./ui/button";
import { Eye, Trash2 } from "lucide-react";

// Props: resumes to show, onDelete handler, onView handler, loading for upload, deletingId for per-resume delete
// Only disable the delete button for the resume being deleted

type Props = {
  resumes: Resume[];
  onDelete: (id: number) => void;
  onView: (resume: Resume) => void;
  loading: boolean;
  deletingId: number | null;
};

const ResumeList: React.FC<Props> = ({
  resumes,
  onDelete,
  onView,
  loading,
  deletingId,
}) => (
  <div className="space-y-4">
    {resumes.length === 0 ? (
      <div className="text-muted-foreground text-center">
        No resumes uploaded yet.
      </div>
    ) : (
      resumes.map((resume) => (
        <div
          key={resume.id}
          className="card-hover border-2 border-blue-100 hover:shadow-lg transition-all duration-300 group bg-white p-4 rounded-lg shadow flex items-center justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
            <span
              className="font-medium text-blue-900 truncate max-w-xs"
              title={resume.filename}>
              {resume.filename}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              {resume.uploadedAt}
            </span>
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-50 text-blue-700 ml-2">
              {resume.status}
            </span>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              title="View"
              aria-label="View"
              onClick={() => onView(resume)}>
              <Eye className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Delete"
              aria-label="Delete"
              onClick={() => onDelete(resume.id)}
              disabled={deletingId === resume.id}>
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      ))
    )}
  </div>
);

export default ResumeList;
