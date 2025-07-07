import React from "react";
import { JD } from "../interfaces/jobDescription.interface";
import JobDescriptionCard from "./JobDescriptionCard";

type Props = {
  jobDescriptions: JD[];
  onView: (jd: JD) => void;
  onEdit: (jd: JD) => void;
  onDelete: (id: number) => void;
};

const JobDescriptionGrid: React.FC<Props> = ({
  jobDescriptions,
  onView,
  onEdit,
  onDelete,
}) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {jobDescriptions.map((jd) => (
      <JobDescriptionCard
        key={jd.id}
        jobDescription={jd}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);

export default JobDescriptionGrid;
