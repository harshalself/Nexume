import React from "react";
import { JD } from "../services/jobDescription.service";
import {
  X,
  Building,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Modal from "./ui/Modal";
import { Button } from "./ui/button";

interface Props {
  jobDescription: JD;
  onClose: () => void;
}

const JobDescriptionView: React.FC<Props> = ({ jobDescription, onClose }) => (
  <Modal open={!!jobDescription} onClose={onClose}>
    <div className="relative bg-white rounded-lg shadow-xl max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {jobDescription.title}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
          onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-6">
        {/* Status and Meta Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {jobDescription.status === "Active" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-400" />
            )}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                jobDescription.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
              {jobDescription.status}
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              Created: {new Date(jobDescription.created).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Company and Location Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Building className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">Company</div>
              <div className="text-sm text-gray-500">To be added</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">Location</div>
              <div className="text-sm text-gray-500">To be added</div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Job Description
          </h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {jobDescription.description}
            </p>
          </div>
        </div>

        {/* Requirements Placeholder */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Requirements
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 italic">
              Requirements will be available when the form is updated
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Future: Add edit functionality
              console.log("Edit job description:", jobDescription.id);
            }}>
            Edit Job
          </Button>
        </div>
      </div>
    </div>
  </Modal>
);

export default JobDescriptionView;
