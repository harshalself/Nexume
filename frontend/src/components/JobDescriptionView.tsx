import React from "react";
import { JD } from "../interfaces/jobDescription.interface";
import { X } from "lucide-react";
import Modal from "./ui/Modal";
import { Button } from "./ui/button";

interface Props {
  jobDescription: JD;
  onClose: () => void;
}

const JobDescriptionView: React.FC<Props> = ({ jobDescription, onClose }) => (
  <Modal open={!!jobDescription} onClose={onClose}>
    <div className="relative card-hover border-2 border-blue-100 hover:shadow-lg transition-all duration-300 group bg-white p-6 rounded-lg shadow max-w-xl mx-auto">
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-2 right-2"
        aria-label="Close"
        onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
      <h2 className="text-2xl font-bold mb-2">{jobDescription.title}</h2>
      <div className="mb-2">
        <span className="text-sm text-muted-foreground">Status: </span>
        <span className="text-sm font-medium">{jobDescription.status}</span>
      </div>
      <div className="mb-2">
        <span className="text-sm text-muted-foreground">Created: </span>
        <span className="text-sm">{jobDescription.created}</span>
      </div>
      <div className="mb-4">
        <span className="block text-sm text-muted-foreground mb-1">
          Description:
        </span>
        <p className="text-base whitespace-pre-line">
          {jobDescription.description}
        </p>
      </div>
    </div>
  </Modal>
);

export default JobDescriptionView;
